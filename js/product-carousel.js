/*
 * AUTHOR:
 *      Yiğit Leblebicier (Polybotumian)
 * DESCRIPTION:
 *      Below IIFE is assigned to a variable
 *      due to usage preference in development stage.
 *      You may find a html file at root directory to test it
 *      via typing "productCarousel.build()"
 *      on the web browser console.
 *      Developed with VIM.
 * */

const productCarousel = (() => {
  const PARAMETERS = {
    apiUrl:
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json",
    storagekey_items: "product-carousel-items",
    storagekey_favs: "product-carousel-fav-items",
    appendTo: "product-detail",
    class_container: "product-carousel-container",
    class_container_div: "product-carousel-inner-div",
    class_container_title: "product-carousel-title",
    class_container_button_left: "product-carousel-button-left",
    class_container_button_right: "product-carousel-button-right",
    class_tray: "product-carousel-tray",
    class_track: "product-carousel-track",
    class_item: "product-carousel-item",
    class_item_image_wrapper: "product-carousel-item-image-wrapper",
    class_item_favorite_div: "product-carousel-item-favorite-div",
    class_item_favorite: "product-carousel-item-favorite",
    class_item_image: "product-carousel-item-image",
    class_item_infobox: "product-carousel-item-infobox",
    class_item_title: "product-carousel-item-title",
    class_item_price: "product-carousel-item-price",
  };

  let products,
    favProducts,
    container,
    track,
    items,
    slidePercent = 0,
    index = 0;

  const fetchAndCacheProducts = async () => {
    try {
      console.log("Checking localStorage..");
      products = JSON.parse(localStorage.getItem(PARAMETERS.storagekey_items));
      favProducts = JSON.parse(
        localStorage.getItem(PARAMETERS.storagekey_favs),
      );
      if (products === null) {
        console.log("Fetching product data from the API..");
        const response = await fetch(PARAMETERS.apiUrl);
        if (!response.ok) {
          throw new Error(`failed to fetch: ${response.status}`);
        }
        products = (await response.json()).map((value) => {
          value.favorite = false;
          return value;
        });
        localStorage.setItem(
          PARAMETERS.storagekey_items,
          JSON.stringify(products),
        );
        console.log("Caching data..");
      }
      if (favProducts == null) {
        favProducts = [];
        localStorage.setItem(
          PARAMETERS.storagekey_favs,
          JSON.stringify(favProducts),
        );
      }
      console.log("Found cached data.");
    } catch (error) {
      console.error(`${productCarousel.name}:${error}`);
    }
  };

  const buildItems = () => {
    try {
      console.log("Building items..");
      items = products.map((value, index) => {
        const item = $("<div>", {
          class: String(PARAMETERS.class_item),
          id: String(PARAMETERS.class_item).concat("-", String(index)),
        });
        const imageLink = $("<a>", { href: value.url });
        imageLink.attr("target", "_blank");
        const image = $("<img>", {
          class: PARAMETERS.class_item_image,
          src: value.img,
        });
        imageLink.append(image);
        const optionId = value.url.split("/").pop();
        const isFav =
          favProducts.filter((str) => str == optionId).length > 0
            ? true
            : false;
        const favoriteDiv = $("<div>", {
          class: PARAMETERS.class_item_favorite_div,
          id: String("option").concat("-", optionId),
        });
        favoriteDiv.on("click", (event) => {
          const parentElement = $(event.currentTarget);
          const optionId = parentElement.attr("id").split("-").pop();
          const isFavorite = favProducts.includes(optionId);
          parentElement
            .find("svg")
            .toggleClass(PARAMETERS.class_item_favorite, !isFavorite);

          if (isFavorite) {
            favProducts = favProducts.filter((str) => str !== optionId);
          } else {
            favProducts.push(optionId);
          }
          localStorage.setItem(
            PARAMETERS.storagekey_favs,
            JSON.stringify(favProducts),
          );
        });
        const svg = ` 
        <svg class="${isFav ? PARAMETERS.class_item_favorite : ""}" xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
          <path stroke-width="1.5px" 
            d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 
               4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 
               8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 
               5.461 5.461 0 0 0 .163-2.012z" 
            transform="translate(.756 -1.076)">
          </path>
        </svg>`;
        favoriteDiv.append(svg);
        const imageWrapper = $("<div>", {
          class: PARAMETERS.class_item_image_wrapper,
        });
        imageWrapper.append(imageLink, favoriteDiv);
        const titleDiv = $("<div>", {});
        const titleLink = $("<a>", {
          href: value.url,
          text: value.name,
          class: PARAMETERS.class_item_title,
        });
        titleLink.attr("target", "_blank");
        titleDiv.append(titleLink);
        const priceDiv = $("<p>", {
          class: PARAMETERS.class_item_price,
        });
        const price = $("<p>", {
          class: PARAMETERS.class_item_price,
          text: String(value.price).concat(" ", "TRY"),
        });
        priceDiv.append(price);
        const infoBox = $("<div>", { class: PARAMETERS.class_item_infobox });
        infoBox.append(titleDiv, priceDiv);
        item.append(imageWrapper, infoBox);
        return item;
      });
      console.log("Items ok!");
    } catch (error) {
      console.error(`Items failed: ${error}`);
    }
  };

  const buildContainer = () => {
    try {
      console.log("Building container..");
      track = $("<div>", { class: PARAMETERS.class_track });
      track.append(items);
      tray = $("<div>", { class: PARAMETERS.class_tray });
      const leftButton = $("<button>", {
        class: PARAMETERS.class_container_button_left,
      });
      leftButton.on("click", () => {
        moveSlide(1);
      });
      const leftButtonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>`;
      leftButton.append(leftButtonSvg);
      const rightButton = $("<button>", {
        class: PARAMETERS.class_container_button_right,
      });
      rightButton.on("click", () => {
        moveSlide(-1);
      });
      const rightButtonSvg = `<svg xmlns="http://www.w3.org/2000/svg" transform="matrix(-1,0,0,1,0,0)" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>`;
      rightButton.append(rightButtonSvg);
      tray.append(leftButton, track, rightButton);
      container = $("<div>", {
        class: String(PARAMETERS.class_container),
      });
      const title = $("<p>", {
        class: PARAMETERS.class_container_title,
        text: "You Might Also Like",
      });
      const titleDiv = $("<div>", {});
      titleDiv.append(title);
      const containerDiv = $("<div>", {
        class: PARAMETERS.class_container_div,
      });
      containerDiv.append(titleDiv, tray);
      container.append(containerDiv);
      $(".".concat(PARAMETERS.appendTo)).append(container);
      console.log("Container ok!");
    } catch (error) {
      console.error(`Container failed: ${error}`);
    }
  };

  const buildCss = () => {
    const CSS = $("<style>", {
      html: ` 
    .${PARAMETERS.class_container} {
        display: flex;
        justify-content: center;
        margin: 0 auto;
    }
    .${PARAMETERS.class_container_div} {
        display: block;
        width: 80%;
    }
    .${PARAMETERS.class_container_title} {
        font-size: 32px;
        line-height: 43px;
        font-weight: lighter;
        padding: 15px 0;
        margin: 0;
        color: #29323b;
    }
    .${PARAMETERS.class_tray} {
        display: flex;
        flex-flow: row;
        overflow: hidden;
        width: 100%;
        margin: 0 auto;
    }
    .${PARAMETERS.class_container_button_left},
    .${PARAMETERS.class_container_button_right} {
        width: 22.25px;
        height: 30.9667px;
        margin: 0;
        align-self: center;
        background: none;
        border: none;
        cursor: pointer;
        position: absolute;
    }
    .${PARAMETERS.class_container_button_left} {
        left: 8%;
    }
    .${PARAMETERS.class_container_button_right} {
        right: 8%;
    }
    .${PARAMETERS.class_track} {
        display: inline-flex;
        width: 100%;
        gap: 1.3%;
        overflow: visible;
        z-index: 0;
        transition: transform 300ms cubic-bezier(.645,.045,.355,1);
        will-change: transform;
    }
    .${PARAMETERS.class_item} {
        display: flex;
        flex-direction: column;
        flex: 0 0 21rem;
        background-color: #fff;
    }
    .${PARAMETERS.class_item_favorite_div} {
        display: flex;
        justify-content: center;
        align-items: center;
        border: solid .5px #b6b7b9;
        border-radius: 5px;
        box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
        position: absolute;
        top: 9px;
        right: 15px;
        width: 34px;
        height: 34px;
        background-color: #fff;
        cursor: pointer;
    }
    .${PARAMETERS.class_item_favorite_div} svg{
        fill: none;
        stroke: #555;
    }
    .${PARAMETERS.class_item_favorite} {
        fill: #193db0 !important;
        stroke: #193db0 !important;
    }
    .${PARAMETERS.class_item_image} {
        width: 100%;
    }
    .${PARAMETERS.class_item_title} {
        text-decoration: none !important;
        color: #302e2b !important;
        white-space: collapse;
        width: 100%;
        display: -webkit-box;
        margin: 0 0 10px;
    }
    .${PARAMETERS.class_item_price} {
        color: #193db0;
        font-size: 18px;
        line-height: 22px;
        font-weight: bold;
    }
    .${PARAMETERS.class_item_infobox} {
        padding: 0 10px;
        overflow: hidden;
    }
    .${PARAMETERS.class_item_image_wrapper} {
        position: relative;
        max-width: 100%;
    }
     `,
    });
    CSS.appendTo("head");
  };

  const moveSlide = (direction) => {
    const visibleItems = Math.floor(
      tray.width() / $(".product-carousel-item").outerWidth(true),
    );
    const len = items.length - (visibleItems - 1);
    index += -direction;
    if (index < 0 || index >= len) {
      index = Math.max(0, Math.min(index, len - 1));
      return;
    }
    const gapInPixels = (1.3 / 100) * track.width();
    const rootFontSize = parseFloat($("html").css("font-size"));
    const gapInRem = gapInPixels / rootFontSize;
    slidePercent += direction * (21 + gapInRem);
    track.css({ transform: `translateX(${slidePercent}rem)` });
  };

  const build = async () => {
    await fetchAndCacheProducts(PARAMETERS.apiUrl);
    buildCss();
    buildItems();
    buildContainer();
  };

  const self = {
    build,
  };

  return self;
})();
