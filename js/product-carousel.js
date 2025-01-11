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
  const OPTIONS = {
    apiUrl:
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json",
    html: {
      container: {
        appendTo: "product-detail",
        className: "product-carousel-container",
      },
      item: {
        className: "product-carousel-item",
      },
    },
    css: {
      appendTo: "head",
      className: "carousel-style",
    },
    storageNames: {
      products: "products",
      favs: "favorited_products",
    },
  };

  const fetchProdData = async (url) => {
    try {
      const isDataCached =
        localStorage.key(0) == OPTIONS.storageNames.products ? true : false;
      if (!isDataCached) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`failed to fetch: ${response.status}`);
        }
        const responseJson = await response.json();
        localStorage.setItem(
          OPTIONS.storageNames.products,
          JSON.stringify(responseJson),
        );
        return responseJson;
      }
      return JSON.parse(localStorage.getItem(OPTIONS.storageNames.products));
    } catch (error) {
      console.error(`${this.fetchProdData.name}:${error}`);
    }
  };

  const buildItems = (prodList, className) => {
    items = prodList.map((value, index) =>
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
    container.append(buildItems(prodList, OPTIONS.html.item.className));
    $(`.${element}`).append(container);
  };

  const buildContainerCss = (element, classSelector) => {
    const CSS = $("<style>", {
      id: "fsdf",
      html: ` 
    .${classSelector} {
        background-color : red;
        color: white;
        }
     `,
    });
    CSS.appendTo(String(element));
  };

  const setEvents = () => {};

  const build = async () => {
    const prodListJson = await fetchProdData(OPTIONS.apiUrl);

    buildContainerCss(OPTIONS.css.appendTo, OPTIONS.html.container.className);

    buildHtml(
      OPTIONS.html.container.appendTo,
      OPTIONS.html.container.className,
      prodListJson,
    );
  };

  const self = {
    build,
  };

  return self;
})();
