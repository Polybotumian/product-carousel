/*
 * AUTHOR:
 *      Yiğit Leblebicier (Polybotumian)
 * DESCRIPTION:
 *      Below IIFE is assigned to a variable
 *      due to usage preference in development stage.
 *      You may find a html file at root directory to test it
 *      via typing "productCarousel.build()"
 *      on the web browser console.
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
      item: {
        className: "product-carousel-item",
      },
    },
    css: {
      className: "carousel-style",
    },
    storageNames: {
      products: "products",
      favs: "favorited_products",
    },
  };
  const getProductData = async (url) => {
    try {
      const data = localStorage.getItem(PARAMETERS.storageNames.products);
      if (!data) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`failed to fetch: ${response.status}`);
        }
        const responseJson = await response.json();
        localStorage.setItem(
          PARAMETERS.storageNames.products,
          JSON.stringify(responseJson),
        );
        return responseJson;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error(`${productCarousel.name}:${error}`);
      return [];
    }
  };

  const buildItems = (prodList, className) => {
    const items = prodList.map((value, index) =>
      $("<div>", {
        class: String(className),
        id: String(className).concat(["-", String(index)]),
        text: value.name,
      }),
    );
    return items;
  };

  const buildHtml = (element, className, prodList) => {
    const container = $("<div>", { class: String(className) });
    container.append(buildItems(prodList, className));
    $(".".concat(element)).append(container);
  };

  const buildContainerCss = (classSelector) => {
    const CSS = $("<style>", {
      html: ` 
    .${classSelector} {
        background-color : red;
        color: white;
        }
     `,
    });
    CSS.appendTo("head");
  };

  const build = async () => {
    const productsJson = await getProductData(PARAMETERS.apiUrl);
    buildContainerCss(PARAMETERS.html.container.className);

    buildHtml(
      PARAMETERS.html.container.parentElem,
      PARAMETERS.html.container.className,
      productsJson,
    );
  };

  const self = {
    build,
  };

  return self;
})();
