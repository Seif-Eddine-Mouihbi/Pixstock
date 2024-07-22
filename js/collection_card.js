/**
 * @copyright Seif Eddine Mouihbi 2024
 * @author Seif <mouihbiseif@gmail.com>
 */

"use strict";

/**
 * Import
 */

import { ripple } from "./utils/ripple.js";

/**
 * Create collection card
 * @param {Object} collection Collection object
 * @returns {Node} Collection card
 */

export const collectionCard = (collection) => {
  const /** {String} */ root = window.location.origin;

  const { id, title, media_count } = collection;

  const /** {NodeElement} */ $card = document.createElement("div");
  $card.classList.add("grid-card", "list-item", "two-line");
  $card.setAttribute("title", title);

  $card.innerHTML = `
         <div>
            <h3 class="body-large">${title}</h3>
            <p class="body-medium label">${media_count}</p>
        </div>
        <a href="${root}/pages/collections/collection_detail.html?collectionId=${id}&title=${title}" class="state-layer"></a>
    `;

  ripple($card);
  
  return $card;
};