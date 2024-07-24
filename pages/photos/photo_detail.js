/**
 * @copyright Seif Eddine Mouihbi 2024
 * @author Seif <mouihbiseif@gmail.com>
 */

"use strict";

/**
 * Import
 */

import { client } from "../../js/api_configure.js";
import { gridInit, updateGrid } from "../../js/utils/masonry_grid.js";
import { photoCard } from "../../js/photo_card.js";
import { menu } from "../../js/menu.js";
import { favorite } from "../../js/favorite.js";

/**
 * Menu toggle
 */

const /** {NodeList} */ $menuWrappers = document.querySelectorAll(
    "[data-menu-wrapper]"
  );

$menuWrappers.forEach(($menuWrapper) => {
  menu($menuWrapper);
});

/**
 * Add to favorite
 */

const /** {Object} */ favoritePhotos = JSON.parse(
    window.localStorage.getItem("favorite")
  ).photos;
const /** {NodeElement} */ $favoriteBtn =
    document.querySelector("[data-add-favorite");
const /** {String} */ photoId = window.location.search.split("=")[1];

$favoriteBtn.classList[favoritePhotos[photoId] ? "add" : "remove"]("active");
favorite($favoriteBtn, "photos", photoId);

/**
 * Render detail data
 */

const /** {NodeElement} */ $detailWrapper = document.querySelector(
    "[data-detail-wrapper]"
  );
const /** {NodeElement} */ $downloadLink = document.querySelector(
    "[data-download-link]"
  );
const /** {NodeElement} */ $downloadMenu = document.querySelector(
    "[data-download-menu]"
  );

client.photos.detail(photoId, (data) => {
  const { avg_color, height, width, photographer, alt, src } = data;

  $downloadLink.href = src.original;

  Object.entries(src).forEach((item) => {
    const [key, value] = item;
    $downloadMenu.innerHTML += `
            <a href="${value}" download class="menu-item" data-ripple data-menu-item>
             <span class="label-large text">${key}</span>
             <div class="state-layer"></div>
            </a>
        `;
  });

  $detailWrapper.innerHTML = `
        <figure class="detail-banner img-holder" style="aspect-ratio: ${width} / ${height}; background-color: ${avg_color};">
            <img src="${src.large2x}" width="${width}" height="${height}" alt="${alt}" class="img-cover">
        </figure>
        <p class="title-small">Photograph by <span class="color-primary">${photographer}</span></p>
    `;

  const /** {NodeElement} */ $detailImg = $detailWrapper.querySelector("img");
  $detailImg.style.opacity = 0;

  $detailImg.addEventListener("load", function () {
    this.animate(
      {
        opacity: 1,
      },
      {
        duration: 400,
        fill: "forwards",
      }
    );

    if (alt) {
      client.photos.search({ query: alt, page: 1, per_page: 30 }, (data) => {
        loadSimilar(data);
      });
    } else {
      $loader.style.display = "none";
      $photoGrid.innerHTML = "<p>No similar photo found.</p>";
    }
  });
});

const /** {NodeElement} */ $photoGrid =
    document.querySelector("[data-photo-grid]");
const /** {Object} */ photoGrid = gridInit($photoGrid);
const /** {NodeElemnt} */ $loader = document.querySelector("[data-loader]");

/**
 * Load similar photos
 * @param {Object} data Photo data
 */
const loadSimilar = function (data) {
  data.photos.forEach((photo) => {
    const /** {NodeElemnt} */ $card = photoCard(photo);
    updateGrid($card, photoGrid.columnsHeight, photoGrid.$columns);
    $loader.style.display = "none";
  });
};
