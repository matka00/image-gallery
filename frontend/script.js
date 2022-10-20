//create gallery base
const galleryContainer = function () {
  return `
    <h2>Nature Image Gallery</h2>
    <section id='gallery-container'>
    </section>
    `;
};

//create swiper gallery
const swiperContainer = function () {
  return `
        <div class="swiper">
            <div id='slide-container' class="swiper-wrapper">
                <!-- Slides -->
            </div>
            <div class="swiper-pagination"></div>
        
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        
        </div>
            `;
};

function showImages(imageURL, title, photographer) {
  return `
        <div class='swiper-slide'>
            <img src='/images/${imageURL}'>
            <div class='picture-detail-container'>
                <p class'picture-title'>${title}</p>
                <p class='photographer-name'>${photographer}</p>
                <button id='delete-btn' onclick='deleteActive()'></button>
            </div>
        </div>
    `;
}

//create upload form
const uploadFormContainer = function () {
  return `
        <section id='upload-form-container'>
            <h3>Upload a photo of your choice to the gallery</h3>
            <form id="upload-form" action="/api/pictures" method='post' encType="multipart/form-data">
                <input id="photo" name="pictureUrl" type="file" required/>
                <input id="photo-title" name="title" type="text" placeholder="Add the title" required/>
                <input id="photographer" name="photographer" type="text" placeholder="Add the photographer" required/>
                <button id='upload-btn'type="submit">upload</button>
            </form>
        </section>
    `;
};

const uploadFetch = (object) => {
  fetch("/api/pictures", {
    method: "POST",
    body: object,
  }).then(async (response) => {
    let newPictureResponse = await response.json();
    let slideContainer = document.getElementById("slide-container");
    slideContainer.insertAdjacentHTML(
      "beforeend",
      showImages(
        newPictureResponse.uploadDate + newPictureResponse.pictureUrl,
        newPictureResponse.title,
        newPictureResponse.photographer
      )
    );
    document.querySelector(".swiper").swiper.update();
  });
};

//DELETE
const deleteActive = function () {
  let currentImage = document.getElementsByClassName("swiper-slide-active")[0];
  let img = currentImage.querySelector("img");
  let pictureUrl = img.src.replace(img.baseURI + "images/", "");
  fetch(`/api/pictures?pictureUrl=${pictureUrl}`, {
    method: "DELETE",
  }).then(() => {
    let swiperContainer = document.querySelector(".swiper");
    document.getElementsByClassName("swiper-slide-active")[0].remove();
    swiperContainer.swiper.update();
  });
};

const loadEvent = async function () {
  let rootElement = document.getElementById("root");
  rootElement.insertAdjacentHTML("beforeend", `<h2>Nature Image Gallery</h2>`);
  rootElement.insertAdjacentHTML("beforeend", swiperContainer());
  rootElement.insertAdjacentHTML("beforeend", uploadFormContainer());

  //swiper
  const swiper = new Swiper(".swiper", {
    effect: "cube",
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  //load base images from api/pictures
  let imagesData = await fetch("/api/pictures");
  let imagesJson = await imagesData.json();
  let slideContainer = document.getElementById("slide-container");

  for (let i = 0; i < imagesJson.length; i++) {
    slideContainer.insertAdjacentHTML(
      "beforeend",
      showImages(
        imagesJson[i].uploadDate + imagesJson[i].pictureUrl,
        imagesJson[i].title,
        imagesJson[i].photographer
      )
    );
  }

  //upload new pictures to image folder and images.json
  const uploadPictureForm = document.getElementById("upload-form");
  uploadPictureForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let formData = new FormData(uploadPictureForm);
    uploadFetch(formData);
    uploadPictureForm.reset();
  });
};

window.addEventListener("load", loadEvent);
