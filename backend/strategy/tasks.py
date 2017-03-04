from celery import shared_task


@shared_task(bind=True)
def sub2(self):
    print 'this is sub2', self.request.id


@shared_task(bind=True)
def sub(self, request):
    print 'sub', self.request.id
    for i in range(10):
        sub2.delay() 
    return 'sub'
