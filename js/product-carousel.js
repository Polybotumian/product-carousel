/*
 * AUTHOR:
 *      Yiğit Leblebicier (Polybotumian)
 * DESCRIPTION:
 *      Below IIFE is assigned to a variable
 *      due to usage preference in development stage.
 *      You may find a html file at root directory to test it
 *      via typing "productCarousel.build()"
 *      on the web browser console.
 *
 *      Developed with VIM.
 * */

const productCarousel = (() => {
  const PARAMETERS = {
    apiUrl:
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json",
    html: {
      container: {
        parentElem: "product-detail",
        className: "product-carousel-container",
      },
      track: {
        className: "product-carousel-track",
      },
      item: {
        className: "product-carousel-item",
      },
    },
    storageNames: "product-carousel-items",
  };

  var products = [];

  const fetchAndCacheProducts = async () => {
    try {
      if (products.length == 0) {
        const response = await fetch(PARAMETERS.apiUrl);
        if (!response.ok) {
          throw new Error(`failed to fetch: ${response.status}`);
        }
        products = (await response.json()).map((value) => {
          value.favorite = false;
          return value;
        });
        localStorage.setItem(PARAMETERS.storageNames, JSON.stringify(products));
      }
    } catch (error) {
      console.error(`${productCarousel.name}:${error}`);
    }
  };

  const buildItems = () => {
    const items = products.map((value, index) => {
      const item = $("<div>", {
        class: String(PARAMETERS.html.item.className),
        id: String(PARAMETERS.html.item.className).concat(["-", String(index)]),
      });
      const image = $("<img>", { src: value.img });
      const name = $("<span>", { text: value.name });
      const price = $("<span>", { text: value.price });
      item.append(image, name, price);
      return item;
    });
    return items;
  };

  const buildContainer = () => {
    const track = $("<div>", {});
    track.append(buildItems());
    const container = $("<div>", {
      class: String(PARAMETERS.html.container.className),
    });
    container.append(track);
    $(".".concat(PARAMETERS.html.container.parentElem)).append(container);
  };

  const buildCss = () => {
    const CSS = $("<style>", {
      html: ` 
    .${PARAMETERS.html.container.className} {
        display: block;
        position: relative;
        width: 80%;
        overflow: hidden;
    }
    .${PARAMETERS.html.track.className} {
        display: flex;
    }
    .${PARAMETERS.html.item.className} {
        display: grid;
    }
    .${PARAMETERS.html.item.className} img {
        width: 25px;
    }
     `,
    });
    CSS.appendTo("head");
  };

  const build = async () => {
    await fetchAndCacheProducts(PARAMETERS.apiUrl);
    buildCss();
    buildContainer();
  };

  const self = {
    build,
  };

  return self;
})();

productCarousel.build();
