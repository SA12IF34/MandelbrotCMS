from django.test import TestCase
from .serializers import NoteSerializer
from .models import Note


class NotesTestCase(TestCase):

    def setUp(self):
        data = {
            "username": "user",
            "email": "user@mail.com",
            "password": "user123"
        }

        self.client.post("/authentication/apis/register/", data=data)

        self.client.post("/notes/apis/create/", {
            "name": "Note 1", 
            "content": "Note 1 content",
            "user": 1
        })

    def test_create_note(self):

        note_data = {
            "name": 34.3,
            "content": "note 2 content",
            "user": "33"
        }

        res = self.client.post("/notes/apis/create/", data=note_data)
        status_code = res.status_code

        self.assertEqual(status_code, 201)

    def test_get_all_notes(self):
        
        res = self.client.get('/notes/apis/get/')

        json = res.json()
        status_code = res.status_code

        self.assertEqual(len(json), 1)
        self.assertEqual(status_code, 200)

    def test_get_one_note(self):
        
        res = self.client.get('/notes/apis/get/1/')
        status_code = res.status_code

        self.assertEqual(status_code, 200)

    def test_update_note(self):
        
        res = self.client.patch('/notes/apis/update/1/', data={'content': 'note 1 update content'}, content_type='application/json')
        status_code = res.status_code 

        self.assertEqual(status_code, 202)

    def test_delete_note(self):
        res = self.client.delete('/notes/apis/delete/1/')

        status_code = res.status_code

        self.assertEqual(status_code, 204)

    def test_create_wrong_note(self):
        wrong_data = {
            'content': 'note content',
            'user': 1
        }
        res = self.client.post('/notes/apis/create/', data=wrong_data)
        status_code = res.status_code

        self.assertEqual(status_code, 400)

    def test_get_not_existing_note(self):
        
        res = self.client.get('/notes/apis/get/3/')

        status_code = res.status_code 

        self.assertEqual(status_code, 404)

    def test_delete_not_existing_note(self):
    
        res = self.client.delete('/notes/apis/delete/4')
        status_code = res.status_code 


        self.assertEqual(status_code, 301)



class NotesIntegrationTestCase(TestCase):

    def setUp(self):
        data = {
            "username": "user",
            "email": "user@mail.com",
            "password": "user123"
        }

        self.client.post("/authentication/apis/register/", data=data)


    def test_create_read_update_delete(self):

        note_data = {
            'name': 'Note',
            'content': 'Note Content',
            'user': 1
        }

        res_1 = self.client.post('/notes/apis/create/', data=note_data, content_type='application/json')
        self.assertEqual(res_1.status_code, 201)

        res_2 = self.client.get('/notes/apis/get/1/')
        self.assertEqual(res_2.status_code, 200)

        res_3 = self.client.patch('/notes/apis/update/1/', data={'content': 'Note Content Update'}, content_type='application/json')
        self.assertEqual(res_3.status_code, 202)

        res_4 = self.client.delete('/notes/apis/delete/1/')
        self.assertEqual(res_4.status_code, 204)

