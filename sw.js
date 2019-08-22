const version = '20190822202213';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/2019/06/24/Mineral-Moon.html","/2019/06/24/Iris-Nebula.html","/2019/06/13/M57-Whale-Hockey.html","/2019/03/23/sunflower-galaxy.html","/2019/02/05/rosette-ngc2403.html","/2019/01/02/california-nebula.html","/2018/12/27/horsehead-and-crab.html","/2018/12/12/uhc-filter.html","/2018/12/11/wirtanen.html","/2018/12/11/pleiades-and-m42.html","/projects/IPARCOS.html","/projects/JustAPendulum.html","/projects/MathsTests.html","/projects/OpenFocuser.html","/projects/RoverBluetooth.html","/projects/Telescope-Pi.html","/about.html","/categories.html","/projects/JustAPendulum/diy.html","/blog/","/","/manifest.json","/offline.html","/projects.html","/assets/search.json","/search.html","/assets/styles.css","/thanks.html","/redirects.json","/sitemap.xml","/robots.txt","/feed.xml","/assets/logos/logo.png", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
