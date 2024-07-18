from .serializers import NoteSerializer
def get_obj_notes(obj):
    notes = obj.note_set.all()
    serializer = NoteSerializer(instance=notes, many=True)

    return serializer.data