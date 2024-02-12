"""
Validators:
    Validators are functions that returns function to validate input.
    Example validation declaration is below:
    @validate({
        "field_name": str_field(max_length = 2, required=true)
    })
    The validate decorator takes a dictionary representing the required fields and the validator function corresponds to it
    The validator function will be used for validate the field declared in dictionary
"""
from typing import Callable, Any
from django.http import HttpRequest, HttpResponseBadRequest, HttpResponse
from .validator_utils import *

content_parsers: dict[str, Callable[[str | bytes], dict | None]] = {
    "application/json": json_parser
}


def request_body(content_type, fields: dict):
    def decorator(request_view):
        def wrapper(request: HttpRequest, *args, **kwargs):
            if request.content_type != content_type:
                return HttpResponse({"message": "content type is not supported"}, status=415,
                                    content_type="application/json")

            content = content_parsers[content_type](request.body)
            if content is None:
                return HttpResponseBadRequest(str({"message": "Content is not parsable"}), content_type=content_type)
            try:
                validate_content(content, fields)
                combined_kwargs = {**kwargs, **({"content": content})}
                return request_view(request, *args, **combined_kwargs)
            except Exception as err:
                return HttpResponseBadRequest(str({"message": str(err)}), content_type=content_type)
        return wrapper

    return decorator


def str_field(**kwargs):
    """
        Keys:
            max_length: Maximum length of string
            min_length: Minimum length of string
            required: Indicates whether it is required or not
    """
    checklist = list()
    checklist.append(lambda x: isinstance(x, str))

    if kwargs.get("max_length", None) is not None:
        checklist.append(lambda x: len(x) <= kwargs["max_length"])
    if kwargs.get("min_length", None) is not None:
        checklist.append(lambda x: len(x) >= kwargs["min_length"])

    return validator(checklist, kwargs.get("required", False))


def number_field(**kwargs):
    """
        Keys:
            max_length: Maximum limit of number
            min_length: Minimum limit of number
            required: Indicates whether it is required or not
    """

    checklist = list()
    checklist.append(lambda x: isinstance(x, int) or isinstance(x, float))
    if kwargs.get("max_length", None) is not None:
        checklist.append(lambda x: x <= kwargs["max_length"])
    if kwargs.get("min_length", None) is not None:
        checklist.append(lambda x: x >= kwargs["min_length"])
    return validator(checklist, kwargs.get("required", False))
