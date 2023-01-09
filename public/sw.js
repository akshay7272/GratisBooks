let cacheData = "gratisBookV1"

this.addEventListener("install",(event)=>{
  event.waitUntil(
    caches.open(cacheData).then((cache)=>{
      cache.addAll([
        "/static/js/bundle.js",
        "/index.html",
        "/"
      ])
    })
  )
})

this.addEventListener("fetch",(event)=>{
  if(!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((result)=>{
        if(result) {
          return result
        }
        let requestUrl = event.request.clone();
        return fetch(requestUrl)
      })
    )
  }
})