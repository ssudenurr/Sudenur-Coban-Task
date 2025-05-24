var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
document.head.appendChild(script);

//ikonlar için font awesome dahil etme
const iconLink = document.createElement("link");
link.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
link.rel = "stylesheet";

//Linki <head> alanına ekle
$("head").append(iconLink);
    
(() => {  const init = () => {
if (window.location.href === "https://www.e-bebek.com/") { // homepage sayfasında olup olmadığı kontrol etmeye çalıştım
  fetchProduct();
} else {
  console.log("wrong page");
}

  };
  let productData = [];
  const $previousWrapper = $(".Section1.has-components");

  const fetchProduct = () => {
    fetch(
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json" //apiden verileri çekiyor
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Hatası: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        productData = data;
          reset();
          buildHTML();
          buildCSS();
          setEvents();
      })
      .catch((error) => console.error("Hata:", error));
  };

  const reset = () => {
    $(".sude-odev").remove();
    $(".sude-style").remove();
  };

  const buildHTML = () => {
    let html = `
            <div class="container sude-odev">
                <h1 class="section-header">Beğenebileceğinizi düşündüklerimiz</h1>
                <div class="carousel-container">
            <div class="carousel-track">
            `;

    productData.forEach((product) => { // apiden gelen verileri tek tek gezerek ilgili yerlere yerleştirme
      const isFavorite =
        JSON.parse(localStorage.getItem(`favorite-${product.id}`)) || false; // ürünün favorilenip favorilenmediğinin kontrolü
      const heartClass = isFavorite ? "active" : "";

      html += `
            <div class="product-card" product-id="${product.id}">
                <a href="${product.url}" target="_blank">
                  <img src="${product.img}" class="product-image">
                  <h2 class="product-name">
                      <b class="product-brand">${product.brand} -</b>
                      <span >${product.name}</span>
                  </h2>
                    <div class="rating">
                        <div class="stars">★★★★★</div>
                          <div class="count">(${ //verilen apide rate bilgisi yoktu ama görüntünün aynısı olması istendiği için şekil olarak ekledim
                            product.id < 100
                              ? 172
                              : product.id < 200
                              ? 487
                              : product.id < 300
                              ? 360
                              : product.id < 400
                              ? 93
                              : 12
                          })</div>
                      </div>
                      <div class="price-container">${
                        product.original_price &&
                        parseFloat(product.original_price) !==
                          parseFloat(product.price)
                          ? `
                          <p class="original_price" style="text-decoration:line-through;">${
                            product.original_price
                          }</p>
                           <span class="discount-badge" > 
                              %${Math.round( // ürünün indirim yüzdesini hesaplama 
                                ((parseFloat(product.original_price) -
                                  parseFloat(product.price)) /
                                  parseFloat(product.original_price)) *
                                  100
                              )}
                          </span>
                          <p class="price" >${
                            product.price
                          } TL</p>
                         
                          `
                          : `
                          <p class="original_price">${
                            product.original_price || product.price 
                          }TL</p>
                          `
                      } 
                      </div>
                </a>    
                <button class="addToCard">Sepete Ekle</button>

            <div class="heart-container" data-product-id="${product.id}">  
                <div class="heart">
                    <img id="default-favorite" src="https://www.e-bebek.com/assets/svg/default-favorite.svg" class="heart-icon" >
                    <img src="https://www.e-bebek.com/assets/svg/default-favorite.svg" class="favorited-heart hovered ${heartClass}" data-product-id="${product.id}"></img>
                </div>
                <div class="favorited-heart">
                  <img id="default-favorite" src="https://www.e-bebek.com/assets/svg/added-favorite.svg" class="heart-icon" >
                  <img src="https://www.e-bebek.com/assets/svg/added-favorite-hover.svg" class="heart-icon hovered ${heartClass}" data-product-id="${product.id}"></img>
                </div>
            </div>

                  
            </div>
            `;
    });
    //ürünler arasında gezinmek için butonlar
    html += ` 
            </div> <!-- carousel-track -->
            <div class="slide-buttons">
                <button class="slider-button" id="prev">&#10094;</button>
                <button class="slider-button" id="next">&#10095;</button>
            </div>
        </div> <!-- carousel-container -->
        </div>
       
        `;

    $previousWrapper.after(html);
  };

  const buildCSS = () => {
    const css = `
        .container.sude-odev{
          padding-top:20px;

        }
        .section-header{
            margin-top:20px
            display: flex;
            font-family: Quicksand-Bold;
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.11;
            color: #f28e00;
            align-items: center;
            justify-content: space-between;
            background-color: #fef6eb;
            padding: 25px 67px;
            border-top-left-radius: 35px;
            border-top-right-radius: 35px;
            font-weight: 700;
        }  
            .carousel-container {
            position: relative;
            width: 100%;
            overflow: hidden;
        }
        .carousel-track {
            display: flex;
            transition: transform 0.3s ease;
            width: 100%; 
            gap:15px;
        }
        .product-card {
            font-family: Poppins, "cursive";
            display: flex;
            flex-direction: column;
            margin-top:16px;
            padding: 10px;
            box-sizing: border-box;
            background-color: #ffffff;
            text-align: left;
            position: relative;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            height: auto; 
            min-height: 420px; 
            flex: 0 0 calc(20% - 12px); 
        }
        .product-card:hover{
            border: 3px solid #f28e00;
        }
        .product-card img {
            position: relative;
            display: block;
            width: 100%;
            background-color: #fff;
            margin-bottom: 65px;
        }
        .product-name {
            font-size: 12px;
            color: #4a4a4a;
            line-height: 1.3;
            font-weight: normal;
            text-align: left;
            margin-bottom: 8px;
            height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .rating {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .rating .stars {
            color: #f5a623; 
            font-size: 22px; 
            margin-right: 5px;
        }
        .rating .count {
            color: #9b9b9b; 
            font-size: 11px; 
        }
        
        .price-container {
            display: flex;
            gap: 10px;
        }
        .price {
            display: block;
            width: 100%;
            font-size: 2.2rem;
            font-weight: 600;
            color: #00a365;
        }
        .original_price {
            font-size: 2.2rem;
            font-weight: 600;
            color: rgb(125, 125, 125);
        }
        .discount-badge{
          color: #00a365;
          font-size: 18px;
          font-weight: 700;
          display: inline-flex;
          justify-content: center;
        }
        .heart{
            right: 15px;
            top: 10px;
            position: absolute;
            cursor: pointer;
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 4px 0 #00000024;
        }
        .heart #default-favorite{
            position: absolute;
            top: 11px !important;
            right: 11px !important;
            width: 20px !important;
            height: 20px !important;
          }

        .heart img{
            width: 42px !important;
            height: 42px !important;
        }

        .favorited-heart {
            display: none;
            right: 15px;
            top: 10px;
            position: absolute;
            cursor: pointer;
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 4px 0 #00000024;
        }

        .addToCard{
            width: 100%;
            padding: 15px 20px;
            border-radius: 37.5px;
            background-color: #fff7ec;
            color: #f28e00;
            font-family: Poppins, "cursive";
            font-size: 1.4rem;
            font-weight: 700;
            margin-top: 25px;
        }
        .addToCard:hover{
            background-color: #f28e00;
            color: white;
        }
        .slide-buttons {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            transform: translateY(-50%);
            z-index: 10;
        }
        #prev{
          color:#f28e00;
          background-color: #fef6eb;
          background-position: 18px;
          font-size: 20px;
          left: -65px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          bottom: 50%;
          top: auto;
        }
        #next{
            color:#f28e00;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 20px;
            bottom: 50%;
            top: auto;
            background-color: #fef6eb;
            background-position: 18px;
            right: -65px;
        }
        .slider-button:hover{
        background-color: #ffffff;
        border: 1px solid #f28e00;
        }
        /* Responsive Ayarlar */
        @media (max-width: 1400px) {
            .product-card {
                flex: 0 0 calc(25% - 11.25px); /* 4 ürün */
            }
        }
        @media (max-width: 1300px) {
            .product-card {
                flex: 0 0 calc(33.33% - 10px); /* 3 ürün */
            }
            
        }
        @media (max-width: 992px) {
            .product-card {
                flex: 0 0 calc(50% - 7.5px); /* 2 ürün  */
            }
            .product-wrapper {
                width: 90%;
            }
            .product-name {
                font-size: 11px;
            }
            .price {
                font-size: 18px;
            }
            .rating .stars {
                font-size: 16px;
            }
        }

        @media (max-width: 576px) {
            .product-card {
                flex: 0 0 100%; /* 1 ürün */
            }
            .product-wrapper {
                width: 95%;
                padding: 0 1%;
            }
            .slide-buttons {
                top: 40%; 
            }
            #prev, #next {
                font-size: 30px;
                padding: 15px;
            }
        }

            `;

    $("<style>").addClass("sude-style").html(css).appendTo("head");
  };

  const setEvents = () => {
    let currentIndex = 0;
    const $track = $(".carousel-track");
    const totalProducts = $(".product-card").length;
    //Ekran boyutuna göre sayfada görüntülenecek ürün sayısı
    function getVisibleProducts() {
      const windowWith = $(window).width();
      if (windowWith < 576) return 1;
      if (windowWith < 992) return 2;
      if (windowWith < 1300) return 3;
      if(windowWith < 1400) return 4;
      return 5;
    }
      //ürünler arasında gezinmeyi sağlar
    function updateCarouselSize() {
      const visibleProducts = getVisibleProducts();
      const slideWith = 100 / visibleProducts;
      const maxIndex = totalProducts - visibleProducts;

      //sayfa boyutunda gösterilen ürün sayısına göre gezinmeyi ayarlar
      if (currentIndex > maxIndex) {
        currentIndex = 0;
      } else if (currentIndex < 0) {
        currentIndex = maxIndex;
      }

      const translateX = -(currentIndex * slideWith);
      $track.css("transform", `translateX(${translateX}%)`);
    }
    //sonraki ürünü gösterir
    $("#next").on("click", () => {
      currentIndex += 1;
      updateCarouselSize();
    });
    //önceki ürünü gösterir
    $("#prev").on("click", () => {
      currentIndex -= 1;
      updateCarouselSize();
    });

    //ürünü local storage'a favori olarak kaydeder
  $(".heart-container").each(function () {
    const $container = $(this);
    const productId = $container.data("product-id");

    const isFavorited = localStorage.getItem(`favorite-${productId}`);
    if (isFavorited) {
      $container.find(".heart").hide();
      $container.find(".favorited-heart").show();
    } else {
      $container.find(".heart").show();
      $container.find(".favorited-heart").hide();
    }

    $container.find(".heart, .favorited-heart").on("click", function () {
      const isNowFavorited = localStorage.getItem(`favorite-${productId}`);

      if (isNowFavorited) {
        localStorage.removeItem(`favorite-${productId}`);
        $container.find(".heart").show();
        $container.find(".favorited-heart").hide();
      } else {
        localStorage.setItem(`favorite-${productId}`, true);
        $container.find(".heart").hide();
        $container.find(".favorited-heart").show();
      }
    });
  });


    $(window).on("resize", updateCarouselSize);
    updateCarouselSize();
  };

  init();
})();
