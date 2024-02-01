window.connectToTv = {
    id: 'connectToTv',
    activationCode: NaN,
    timer:NaN,
    init: function () {
        var connectToTvElement = document.createElement('div');
        connectToTvElement.id = connectToTv.id;
        connectToTvElement.innerHTML = `
        <div class="container">
  <div class="left-container">
    <div class="left-top-content mb-50">
      <div class="binge-icon">
        <svg width="320" height="180" viewBox="0 0 320 180" fill="none">
          <mask id="mask0_670_465" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="6" y="30" width="307" height="120">
            <path d="M312.505 30H6V149.97H312.505V30Z" fill="white" />
          </mask>
          <g mask="url(#mask0_670_465)">
            <path d="M6 50.0002C6 36.6737 14.8297 30 32.4579 30H39.0854C61.1492 30 72.181 38.8913 72.181 56.6426C72.181 65.5339 69.4075 72.1763 63.9227 76.6429C69.4387 81.0677 72.181 87.7519 72.181 96.6431C72.181 114.426 61.1492 123.286 39.0854 123.286H32.4579C14.7985 123.286 6 116.612 6 103.286V50.0002ZM39.127 43.3265H33.0708C29.0403 43.3265 27.0146 45.5441 27.0146 50.0002V70.0005H39.127C47.1775 70.0005 51.2392 65.5759 51.2392 56.6739C51.2392 47.7827 47.2087 43.3161 39.127 43.3161V43.3265ZM39.127 83.3271H27.0146V103.401C27.0146 107.867 29.0403 110.074 33.0708 110.074H39.127C47.1775 110.074 51.2392 105.608 51.2392 96.6849C51.2392 87.7624 47.2087 83.3271 39.127 83.3271Z" fill="white" />
            <path d="M168.186 89.907V123.234H148.324V89.907C148.324 76.5805 143.93 69.9068 135.09 69.9068L130.415 70.0114C126.021 70.0114 123.788 72.229 123.788 76.6851V123.328H103.927V76.6433C103.927 63.3167 112.756 56.643 130.384 56.643L135.059 56.5384C157.154 56.5697 168.186 67.6787 168.186 89.8965V89.907Z" fill="white" />
            <path d="M207.202 123.296C185.17 123.296 174.138 112.219 174.107 90.1056C174.076 71.6325 188.93 56.6428 207.264 56.6428H213.829C231.49 56.6428 240.287 63.3165 240.287 76.6431V116.644C240.287 135.043 225.464 149.97 207.191 149.97H192.098C189.792 149.97 188.515 147.282 189.938 145.472L194.748 139.405C196.139 137.669 198.237 136.644 200.43 136.644H207.161C214.807 136.644 219.106 131.665 220.125 121.717C216.407 122.773 212.074 123.286 207.202 123.286V123.296ZM193.968 89.9696C193.968 103.296 198.362 109.97 207.202 109.97C216.043 109.97 220.437 103.296 220.437 89.9696V76.6431C220.437 72.2183 218.234 69.9694 213.808 69.9694H207.182C198.382 70.0007 193.988 76.6431 193.988 89.9696H193.968Z" fill="white" />
            <path d="M312.432 89.9698L312.505 95.1791C312.505 95.9951 311.861 96.6435 311.08 96.6435H268.272C267.359 96.6435 266.684 97.4908 266.85 98.3799C268.438 106.11 272.605 109.97 279.304 109.97C287.294 109.97 291.656 107.617 292.434 103.903C292.571 103.223 293.142 102.679 293.859 102.679H310.842C311.724 102.679 312.4 103.464 312.266 104.353C310.842 114.437 301.473 122.376 282.795 123.234C262.29 124.186 245.17 107.114 246.354 86.4969C247.466 66.6326 258.467 56.6848 279.345 56.6848C301.409 56.6848 312.441 67.7625 312.441 89.9803L312.432 89.9698ZM290.4 83.3274C291.312 83.3274 291.988 82.4801 291.822 81.591C290.234 73.8608 286.067 70.0009 279.368 70.0009C272.666 70.0009 268.502 73.8504 266.911 81.591C266.745 82.4801 267.421 83.3274 268.336 83.3274H290.4Z" fill="white" />
            <path d="M78.1438 123.359H98.0055V63.0126C98.0055 60.1883 94.9619 58.41 92.5207 59.8431L80.3773 66.9668C78.9853 67.7826 78.1438 69.2471 78.1438 70.8475V123.359Z" fill="white" />
            <path d="M82.2674 33.6087L98.0363 42.7093C100.706 44.2469 100.779 48.1277 98.14 49.6654L82.5791 58.7659C79.9406 60.3036 76.5853 58.3894 76.5541 55.2932L76.3152 37.1025C76.284 34.0376 79.5979 32.092 82.2674 33.6296V33.6087Z" fill="white" />
            <path d="M78.1746 37.5629V55.1783C78.1746 56.946 80.1067 58.0757 81.6234 57.1866L96.7793 48.3999C98.3064 47.5108 98.3064 45.2618 96.7793 44.3831L81.6234 35.5964C80.0653 34.6759 78.1746 35.7637 78.1746 37.5734V37.5629Z" fill="white" />
          </g>
        </svg>
      </div>
      <div class="left-top-content-text ml-30">
        Entertainment made endless
      </div>
    </div>
    <div class="left-bottom-content">
      <div class="active-text mb-40">
        Activate Binge
      </div>
      <div class="steps">
        <div class="single-steps mb-20">
          <div class="square-steps">Step-1</div>
          <div class="step-details ml-30">Open Binge App</div>
        </div>
        <div class="single-steps mb-20">
          <div class="square-steps">Step-2</div>
          <div class="step-details ml-30">Go to More > Connect TV </div>
        </div>
        <div class="single-steps mb-20">
          <div class="square-steps">Step-3</div>
          <div class="step-details ml-30">The screen is automatically refresh </div>
        </div>
      </div>
    </div>

  </div>
  <div class="right-container">
  <div class="qr-code-text">Scan the code using App</div>
    <div id="login-qr-code">
    </div>
    <div class="code-text">Or Type in the code</div>
    <div class="activation-code">
    </div>
  </div>
</div>
        `;
        document.body.appendChild(connectToTvElement);
        this.load();
    },
    keyDown: function(event){
        switch (event.keyCode) {
            case tvKey.KEY_BACK:
            case tvKey.KEY_ESCAPE:
            case tvKey.KEY_LEFT:
                menu.open();
                break;
        }

    },
    start:  function () {
         api.getActivationCode({
            success: function(data){
                try{
                console.log('activation',data);
                window.connectToTv.activationCode = data.activationCode;
                connectToTv.init();
                $(".activation-code").eq(0).html(data.activationCode);
                console.log('active code', $('.activation-code'));
            }catch(e){
                console.log('error ',e);
            }
            }
        });
        
    },
    load:function(){
     connectToTv.updateQRCodeText(connectToTv.activationCode);
       this.timer = setInterval(function(){
            api.verifyActivationCode({
                data:{
                    activation_code: window.connectToTv.activationCode,
                },
                success: function(data){
                    console.log('verify ', data);
                    if(data.customer){
                        window.session.storage.customer = data.customer;
                        window.session.storage.jwtToken = data.token;
                        clearInterval(window.connectToTv.timer);
                        window.connectToTv.destroy();
                        window.session.storage.isAnonymous = false;
                        window.session.update();
                        window.location.reload();
                        main.events.login();   
                    }
                }
            })
        },5000);
        
    },
    destroy: function () {
        clearInterval(connectToTv.timer);
        if (document.getElementById(connectToTv.id)) {
          document.body.removeChild(document.getElementById(connectToTv.id));
        }
    },
    updateQRCodeText: function (paymentLink) {
        $("#login-qr-code").empty();
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
                "width": 500,
                "height": 500,
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
    
        console.log('element ',document.getElementById('login-qr-code'));
        qrCode.append(document.getElementById('login-qr-code'));
        // qrCode.download({ name: "qr", extension: "svg" });
    },
}