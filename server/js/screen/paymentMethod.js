window.paymentMethod = {
  id: 'show-payment-method',
  previous: NaN,
  selectedPaymentMode: NaN,
  allPaymentMode: NaN,
  paymentLink: {
      pgw: NaN,
      nagad: NaN
  },
  paymentMethodName :{
      pgw: 'Online/MFS Payment ',
      nagad: 'Nagad'
  },
  timer:NaN,
  init: function () {
    console.log('inside payment method', subscription.selectedPack);
      var paymentMethod_element = document.createElement('div');
      paymentMethod_element.id = paymentMethod.id;
      paymentMethod_element.innerHTML = `
      <div class="payment-method-page">
<div class="payment-content">
<div class="selected-pack-description">
  <div class="package-title">${subscription.selectedPack.title}</div>
  <div class="package-subtilte-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <g clip-path="url(#clip0_1037_2574)">
        <path d="M17.4538 22.5453C17.8555 22.5453 18.1811 22.2197 18.1811 21.8181C18.1811 21.4164 17.8555 21.0908 17.4538 21.0908C17.0522 21.0908 16.7266 21.4164 16.7266 21.8181C16.7266 22.2197 17.0522 22.5453 17.4538 22.5453Z" fill="white" />
        <path d="M5.09053 26.9091C5.49218 26.9091 5.81778 26.5835 5.81778 26.1818C5.81778 25.7802 5.49218 25.4546 5.09053 25.4546C4.68888 25.4546 4.36328 25.7802 4.36328 26.1818C4.36328 26.5835 4.68888 26.9091 5.09053 26.9091Z" fill="white" />
        <path d="M29.8173 2.90918H5.09002C3.85364 2.90918 2.9082 3.85462 2.9082 5.09099V12.3637C2.9082 12.8001 3.19914 13.091 3.63545 13.091C4.07177 13.091 4.3627 12.8001 4.3627 12.3637V5.09105C4.3627 4.65468 4.65364 4.3638 5.08995 4.3638H29.8172C30.2536 4.3638 30.5445 4.65474 30.5445 5.09105V22.5456C30.5445 22.982 30.2535 23.2729 29.8172 23.2729H12.3627C11.9263 23.2729 11.6355 23.5638 11.6355 24.0001C11.6355 24.4364 11.9264 24.7274 12.3627 24.7274H13.8173V26.9092C13.8173 27.3456 13.5263 27.6364 13.09 27.6364H12.3628C11.9264 27.6364 11.6355 27.9274 11.6355 28.3637C11.6355 28.8 11.9265 29.0909 12.3628 29.0909H22.5446C22.981 29.0909 23.2718 28.8 23.2718 28.3637C23.2718 27.9274 22.9809 27.6364 22.5446 27.6364H21.8173C21.381 27.6364 21.0901 27.3455 21.0901 26.9092V24.7274H29.8173C31.0537 24.7274 31.9991 23.7819 31.9991 22.5456V5.09105C31.9991 3.85468 31.0536 2.90918 29.8173 2.90918ZM15.1263 27.6365C15.1991 27.4183 15.2718 27.2001 15.2718 26.9092V24.7274H19.6354V26.9092C19.6354 27.2002 19.7081 27.4183 19.7808 27.6365H15.1263Z" fill="white" />
        <path d="M28.364 18.9092H12.364C11.9276 18.9092 11.6367 19.2001 11.6367 19.6364C11.6367 20.0727 11.9277 20.3637 12.364 20.3637H28.364C28.8003 20.3637 29.0912 20.0727 29.0912 19.6364C29.0912 19.2001 28.8003 18.9092 28.364 18.9092Z" fill="white" />
        <path d="M8 14.5454H2.18181C0.945438 14.5454 0 15.4909 0 16.7272V26.909C0 28.1454 0.945438 29.0908 2.18181 29.0908H8C9.23637 29.0908 10.1818 28.1454 10.1818 26.909V16.7272C10.1818 15.4909 9.23637 14.5454 8 14.5454ZM8.72725 26.909C8.72725 27.3454 8.43631 27.6363 8 27.6363H2.18181C1.74544 27.6363 1.45456 27.3453 1.45456 26.909V16.7272C1.45456 16.2908 1.7455 16 2.18181 16H8C8.43637 16 8.72725 16.2909 8.72725 16.7272V26.909Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1037_2574">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <div class="package-subtitle ml-20">${subscription.selectedPack.device_stream_details} </div>
  </div>
  <div class='package-price'>
    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="32" viewBox="0 0 27 32" fill="none">
      <path d="M5.16582 0C6.50749 0 7.55823 0.559424 8.31843 1.67748C9.12351 2.7505 9.57073 4.22634 9.66041 6.10483V13.1488H11.5389L14.6918 16.3692H9.66041V25.4927C9.66041 26.2082 9.92867 26.8566 10.4651 27.4382C11.0019 28.0199 11.8742 28.3103 13.0819 28.3102C14.6472 28.3103 16.3021 27.4382 18.0461 25.6942C19.8348 23.9049 20.7741 22.0716 20.8637 20.1932L20.0587 20.2598C17.1964 20.2598 15.7649 18.7394 15.7649 15.698C15.7649 14.6692 16.1005 13.7527 16.7714 12.9478C17.4426 12.1427 18.5603 11.7402 20.1257 11.7402C21.7806 11.7402 23.167 12.4556 24.2852 13.8867C25.4482 15.3181 26.0297 17.0623 26.0297 19.1193C26.0297 22.1608 24.7322 25.068 22.1383 27.8408C19.5891 30.6136 16.5475 32 13.0146 32C11.7178 32.0002 10.3312 31.441 8.85518 30.3232C7.42398 29.1599 6.5745 28.0417 6.30608 26.9687V16.3692H3.0856L0 13.1488H6.30608V6.77598C6.30608 5.47872 5.52344 4.71844 3.95785 4.49483C3.24229 4.49483 2.77294 4.60656 2.54909 4.83033C2.14675 4.15917 1.76645 3.35433 1.40867 2.41516V2.07967C1.40867 1.49843 1.85606 1.00633 2.75042 0.60383C3.64511 0.201329 4.45019 0 5.16582 0Z" fill="white" />
    </svg>
    <div class='package-price-text'>${subscription.selectedPack.display_amount}</div>

  </div>
  </div>
  <div class="payment-list"> </div>
</div>
<div id="payment-qr-code"> </div>
</div>
</div>`;
      paymentMethod.previous = main.state;
      main.state = paymentMethod.id;
      $(`#${subscription.id}`).append(paymentMethod_element);
      $("#subscription .content").hide();
      // subscription.destroy();


      var cutomerApiCalled = 0;
      paymentMethod.load();
      this.updateQRCodeText(this.paymentLink[0]);
      this.timer = setInterval(function() {
      cutomerApiCalled++;
      console.log('cutomerApiCalled',cutomerApiCalled);
      if (cutomerApiCalled ===24){
          console.log('ashe nah ken');
          clearInterval(window.paymentMethod.timer);
          window.paymentMethod.destroy();
      };
          api.getCustomerDetails({
              success: function(data){
                  if(data.customer && data.customer.status_id === 2){
                      window.session.storage.customer = data.customer;
                      window.session.update();
                      clearInterval(window.paymentMethod.timer);
                      window.paymentMethod.destroy();
                      subscription.destroy();
                      window.location.reload();
                      main.init();
                  }
              }
          })
      },30000);
      

  },
  load: async function () {
      var paymentMethod = "";
      var selectedPack = subscription.selectedPack;
      var paymentMode = [];
      if (selectedPack.payment_mode == 'all') {
          paymentMode = ["pgw", "nagad"];
      } else {
          paymentMode = selectedPack.payment_mode.split(",")
      }
      this.allPaymentMode = paymentMode;
      console.log('payment mode', paymentMethod, this.allPaymentMode);
      if (this.allPaymentMode.includes('pgw')) {
          console.log('calling pgw');
          api.getPGWLink({
              data: {
                  customer_id: session.storage.customer.id,
                  package_id: subscription.selectedPack.id,
              },
              success: function (response) {
                  window.paymentMethod.paymentLink.pgw = response.invoice.paymentUrl
                  console.log('response', response, window.paymentMethod.paymentLink);
                  console.log('payment method', window.paymentMethod.allPaymentMode, window.paymentMethod.allPaymentMode[0])
                  window.paymentMethod.updateQRCodeText(window.paymentMethod.paymentLink[window.paymentMethod.allPaymentMode[0]]);
              }

          });
      }
      if (this.allPaymentMode.includes('nagad')) {
          console.log('calling nagad');
          api.getNagadLink({
              data: {
                  customer_id: session.storage.customer.id,
                  package_id: subscription.selectedPack.id,
              },
              success: function (response) {
                  window.paymentMethod.paymentLink.nagad = response.invoice.paymentUrl
                  console.log('response', response, window.paymentMethod.paymentLink);
                  console.log('payment method', window.paymentMethod.allPaymentMode, window.paymentMethod.allPaymentMode[0])
                  window.paymentMethod.updateQRCodeText(window.paymentMethod.paymentLink[window.paymentMethod.allPaymentMode[0]]);

              }

          });
      }

      paymentMode.forEach((mode, index) => {
          paymentMethod += `<div class="payment_mode" onclick="paymentMethod.methodClicked('${index}')">
            ${this.paymentMethodName[mode]}
          </div>`;
      });
      for (var index = 0; index < 2; index++) {
          paymentMethod += `
          <div class="episode">
            <div class="episode-image">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
            </div>
          </div>`;
      }
      $(".subscription .payment-list").eq(0).html(paymentMethod);
      // console.log('session', api.customer);


      $("#subscription .payment-list").slick({
          vertical: true,
          // fade: false,
          dots: false,
          arrows: false,
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 0,
          waitForAnimate: false,
          cssEase: 'ease-in-out'
      });

      $("#subscription .payment-list")[0].slick.slickGoTo(0);
      this.selectedPaymentMode = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
      console.log('this log', this.selectedPaymentMode);

  },

  methodClicked: function(index) {
    console.log('methoddd', index)
    $("#subscription .payment-list")[0].slick.slickGoTo(index);
    this.selectedPaymentMode = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
    // this.updateQRCodeText("instagram.com");
    this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
  },

  keyDown: function (event) {
      switch (event.keyCode) {
          case tvKey.KEY_BACK:
          case 27:
              paymentMethod.destroy();
              break;
          case tvKey.KEY_UP:
              var buttons = $(`.payment-content.payment-mode`);
              console.log('buttons', buttons);
              $("#subscription .payment-list")[0].slick.prev();
              this.selectedPaymentMode = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
              this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
              console.log('this up', this.selectedPaymentMode, this.paymentLink[this.selectedPaymentMode]);

              break;
          case tvKey.KEY_DOWN:
              var buttons = $(`.payment-content.payment-mode`);
              console.log('buttons', buttons);
              $("#subscription .payment-list")[0].slick.next();
              this.selectedPaymentMode = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
              // this.updateQRCodeText("instagram.com");
              this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
              this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
              break;
          case tvKey.KEY_ENTER:
              var selectedPack = subscription.selectedPack;
              var item = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
              console.log('all payment mode', item);
              this.selectedPaymentMode = item;
              console.log('payment mode', this.selectedPaymentMode);
              break;

      }
  },
  destroy: function () {
      clearInterval(this.timer);
      $(`#${paymentMethod.id}`).remove();
      $("#subscription .content").show();
      main.state = paymentMethod.previous;
      $("#subscription .subscription-packages")[0].slick.slickGoTo(subscription.index);
  },
  updateQRCodeText: function (paymentLink) {
      console.log('ami call hpcci');
      $("#payment-qr-code").empty();
      var newText = paymentLink;
      var imageLink = "";
      console.log('payment link', paymentLink);
      // if(paymentLink && paymentLink.includes("sslcommerz")){
      //     imageLink = "https://binge.buzz/assets/svg/card.svg"
      // }else{
      //     imageLink = "https://binge.buzz/assets/svg/nagad.svg"
      // }
      // Customize newText based on your requirements
      // For example, concatenate with this.selectedPaymentMode or any other logic
      // var qrcode = new QRCode(document.getElementById('payment-qr-code'), {
      //     text: newText,
      //     width: 512,
      //     height: 512,
      //     colorDark: '#FFF',
      //     colorLight: '#000',
      //     correctLevel: QRCode.CorrectLevel.H
      // });
      const qrCode = new QRCodeStyling(
          {
              "width": 700,
              "height": 700,
              "data": paymentLink,
              "margin": 5,
              "imageOptions": {
                "hideBackgroundDots": true,
                "imageSize": 0.3,
                "margin": 0
              },
              "dotsOptions": {
                "type": "extra-rounded",
                "color": "#000000",
                "gradient": null
              },
              "backgroundOptions": {
                "color": "#ffffff"
              },
              // image: imageLink,
              "dotsOptionsHelper": {
                "colorType": {
                  "single": true,
                  "gradient": false
                },
                "gradient": {
                  "linear": true,
                  "radial": false,
                  "color1": "#6a1a4c",
                  "color2": "#6a1a4c",
                  "rotation": "0"
                }
              },
              "cornersSquareOptions": {
                "type": "square",
                "color": "#000000"
              },
              "cornersSquareOptionsHelper": {
                "colorType": {
                  "single": true,
                  "gradient": false
                },
                "gradient": {
                  "linear": true,
                  "radial": false,
                  "color1": "#000000",
                  "color2": "#000000",
                  "rotation": "0"
                }
              },
              "cornersDotOptions": {
                "type": "square",
                "color": "#000000"
              },
              "cornersDotOptionsHelper": {
                "colorType": {
                  "single": true,
                  "gradient": false
                },
                "gradient": {
                  "linear": true,
                  "radial": false,
                  "color1": "#000000",
                  "color2": "#000000",
                  "rotation": "0"
                }
              },
              "backgroundOptionsHelper": {
                "colorType": {
                  "single": true,
                  "gradient": false
                },
                "gradient": {
                  "linear": true,
                  "radial": false,
                  "color1": "#ffffff",
                  "color2": "#ffffff",
                  "rotation": "0"
                }
              }
            }
      );
  
      qrCode.append(document.getElementById('payment-qr-code'));
      // qrCode.download({ name: "qr", extension: "svg" });
  },
}