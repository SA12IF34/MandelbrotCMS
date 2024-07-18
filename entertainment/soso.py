import requests 
import secrets 
import json
code = "def502002cf68a1222da15922958bb6b81e977a46898c329378f08541f11def6eaa0a24c415da49482964b45b0d700f7f84522d385465d671a2a8bbb49f5191ef486d8b783853b45b1902cf7a4be081c6a1c109372e43355500e86a9392456b3c2e10f3a4df9a126c8f9e063225bc815d2204759eb2b3fca2551c47cb6fb79e6422c13261b9c8a0dabeee6ec7b5fb50a7366b288df8c27b2c6dfe9b6c8d0f1675ddc0cd4e652aefeb0f9b734989443e53cbc7f5c90fb1a31879672176903a7128944d7c3d15b1462b75c3539503cfc84a7d9cc4b40645a71f3538f0d3b8f504a6eed3d8a46fac797efc6e3b01a1ab6d4c3182e9bcf62f912245fc6b3bee1e0ef08647a7a6f1d4e3b91f95be9f5ad1d0eafd49cc693118cbac557f7b77ffd08d53b8a024d315caf63f0774102e82bdc06a8fbf485f1ff9eba609580c9e0a1e12f4a56e463078e2735fccfdf99f98869da89d81c463807bd5efd831014ff7bbbc2d0acd6606aa38d6dac4a168173144ca06cde6590f1aa1172911483c016399327f8cfb0b0670b1f0562192900d67a0b901e04d21804371b56246747c16d55"

# def get_new_code_verifier() -> str:
#     token = secrets.token_urlsafe(100)
#     return token[:128]


# code_verifier = get_new_code_verifier();

data = {
        'client_id': '533bcbceef8b2ffed855fcce5b0c52fd',
        'client_secret': '591b15350d8d08b5084da8e1ec69b958be7d7bc8c767b0b8de2ab61f95e2013c',
        'code': code,
        'code_verifier': 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
        'grant_type': 'authorization_code'
    }




# # response = requests.post(f'https://myanimelist.net/v1/oauth2/token', data=data)


# # print(response.json())

tokens = json.load(open('tokens.json', 'r'))

access_token = tokens['access_token']
refresh_token = tokens['refresh_token']
data2 = {
    'client_id': '533bcbceef8b2ffed855fcce5b0c52fd',
    'client_secret': '591b15350d8d08b5084da8e1ec69b958be7d7bc8c767b0b8de2ab61f95e2013c',
    'grant_type': 'refresh_token',
    'refresh_token':refresh_token
}
# &grant_type=refresh_token & refresh_token=YOUR_REFRESH_TOKEN
response_2 = requests.post('https://myanimelist.net/v1/oauth2/token', data=data2)

print(response_2.status_code)
print(response_2.json())

if response_2.status_code == 200 or response_2.status_code == 202 or response_2.status_code == 201:
    with open('tokens.json', 'w') as file:
        json.dump(response_2.json(), file, indent=2)
