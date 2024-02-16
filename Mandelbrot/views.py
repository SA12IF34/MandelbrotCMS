from django.shortcuts import render, redirect

def home_page(request):

    if request.user.is_authenticated:
        return redirect('/home/')

    return render(request=request, template_name='website-home/dist/index.html')


def cms_home(request, id=None):

    if request.user.is_authenticated:
        return render(request=request, template_name='home-tasks/dist/index.html')

    return redirect('/')


def account_page(request):

    if request.user.is_authenticated:
        return redirect('/home/')
    
    return render(request=request, template_name='home-tasks/dist/index.html')