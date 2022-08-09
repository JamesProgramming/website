import { canvasLoading } from "./loading";
import { respondWidth } from "./variables";
/**
 *
 * @author James J. Coolidge <jamesjcoolidge.com>
 * @class
 */
export const renderTiles = class {
  /**
   * Fetch and render tiles
   * @param {string} dataFromUrl - Url of json data
   * @param {string} locationQuery - CSS selector string to query location on page to add tiles
   */
  constructor(dataFromUrl, locationQuery, type = "tile") {
    this.type = type;
    this.DOMLocation = document.querySelector(locationQuery);
    this.dataFromUrl = dataFromUrl;
    if (window.innerWidth >= respondWidth)
      this.DOMLocation.insertAdjacentElement("beforeend", canvasLoading());
    else
      this.DOMLocation.insertAdjacentHTML(
        "beforeend",
        `
        <div class="loading">
            <div class="loading__container">
                <div class="loading__box-1"></div>
                <div class="loading__box-2"></div>
            </div>
        </div>
    `
      );
  }

  /**
   * Call to load tile
   * @async
   */
  async render() {
    return new Promise(async (res, rej) => {
      await new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, 2000);
      });
      let data = await (await fetch(this.dataFromUrl)).json();

      this.DOMLocation.innerHTML = "";
      data.data.tiles.forEach((tile) => {
        const elementTile = new DOMParser().parseFromString(
          this.build(tile),
          "text/html"
        ).firstElementChild.lastElementChild.firstElementChild;

        elementTile.style.opacity = 0;
        elementTile.style.transition = ".7s";

        this.DOMLocation.appendChild(elementTile);
        setTimeout(() => {
          elementTile.style.opacity = 1;
        }, 50);
      });
      res();
    });
  }

  build(data) {
    if (this.type == "tile")
      return `
              <div class="tiles__tile">
              <div class="tiles__img">
              <img srcset="${data.img}.webp" src="${data.img}.png" alt="${
        data.alt
      }" />
              </div>
              <header class="tiles__heading">
              <h4 class="heading-4">${data.name}</h4>
              </header>
              <div class="detail-item__item detail-item--icon-compact">
              <svg>
                  <use xlink:href="/img/svg/sprite.svg#icon-notes"></use>
              </svg> 
              <ul>
                  ${data.notes
                    .map((element) => `<li> ${element} </li>`)
                    .join("")}
              </ul>
              </div>
  
              <div class="tiles__tags">
              ${data.tags
                .map(
                  (element) => `
                  <div class="detail-item__item detail-item--info detail-item--compact">
                  <svg>
                  <use
                      xlink:href="/img/svg/sprite.svg#icon-cert-date-icon"
                  ></use>
                  </svg>
                  <p>${element}</p>
                  </div>
              `
                )
                .join("")}
              </div>
  
              <div class="tiles__buttons">
              ${
                data?.sourceCodeUrl
                  ? `
                  <a target="_blank" href="${data.sourceCodeUrl}" class="a-button">
                  <span
                  class="button button--narrow button--no-margin button--gray"
                  ><span>Source code</span></span
                  >
                  </a>
              `
                  : ""
              }
  
              ${
                data?.href
                  ? `
                  <a target="_blank" href="${data.href}" class="a-button"><span class="button button--narrow button--no-margin button--right-arrow">
                  <span>View</span>
                  <svg>
                  <use
                      xlink:href="/img/svg/sprite.svg#icon-right-arrow"
                  ></use>
                  </svg>
                  </span></a>
              `
                  : `
                  <button class="button button--narrow button--no-margin button--right-arrow in-site" data-src="${data.viewImages}">
                  <span>View</span>
                  <svg>
                  <use
                      xlink:href="/img/svg/sprite.svg#icon-right-arrow"
                  ></use>
                  </svg>
                  </button> 
              `
              }
  
              </div>
          </div>
      `;
    if (this.type == "educationTile")
      return `
        <div class="edu-tiles__tile ${
          data.inProgress ? "edu-tiles__tile--in-progress" : ""
        }">
            <header class="edu-tiles__tile-heading">
                <h3 class="heading-3">${data.name}</h3>
            </header>
            <div class="detail-item__item edu-tiles__tile-college" >
                <svg class="has-tool-tip" title="Location">
                <use xlink:href="/img/svg/sprite.svg#icon-edu-location"></use>
                </svg>
                <div class="edu-tiles__tile-college-info">
                <p class="edu-tiles__tile-name">${data.college}</p>
                <p class="edu-tiles__tile-location">${data.location}</p>
                </div>
            </div>
            <div class="detail-item__item edu-tiles__tile-duration" >
                <svg class="has-tool-tip" title="date attended">
                <use xlink:href="/img/svg/sprite.svg#icon-edu-duration"></use>
                </svg>
                <p class="">${data.date}</p>
            </div>
            <div class="detail-item__item" >
                <svg class="has-tool-tip" title="Notes">
                <use xlink:href="/img/svg/sprite.svg#icon-notes"></use>
                </svg>
                <ul>
                    ${data.notes
                      .map((element) => `<li> ${element} </li>`)
                      .join("")}
                </ul>
            </div>
        </div>
      `;
  }
};
