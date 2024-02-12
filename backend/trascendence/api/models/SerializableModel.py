class SerializableModel:
    def to_json(self):
        attrs = self.__dict__
        del attrs['_state']
        return attrs

