window.paymentMethod = {
    id: 'show-payment-method',
    previous: NaN,
    selectedPaymentMode: NaN,
    allPaymentMode:NaN,
    paymentLink:{
        pgw: NaN,
        nagad:NaN
    },
    init: function () {
        var paymentMethod_element = document.createElement('div');
        paymentMethod_element.id = paymentMethod.id;
        paymentMethod_element.innerHTML = `
        <div class="payment-method-page">
        <div class="payment-content">
        <div class="payment-list"> </div>
            </div>
            <div id="payment-qr-code"> </div>
        </div></div>`;
        paymentMethod.previous = main.state;
        main.state = paymentMethod.id;
        $(`#${subscription.id}`).append(paymentMethod_element);
        $("#subscription .content").hide();
        
        
        paymentMethod.load();
        this.updateQRCodeText(this.paymentLink[0]);

    },
    load: async function(){
        var paymentMethod = "";
        var selectedPack = subscription.selectedPack;
        var paymentMode  = [];
        if(selectedPack.payment_mode == 'all'){
            paymentMode =["pgw", "nagad"];
        }else{
            paymentMode =selectedPack.payment_mode.split(",")
        }
        this.allPaymentMode = paymentMode;
        console.log('payment mode', paymentMethod, this.allPaymentMode);
        if(this.allPaymentMode.includes('pgw')){
            console.log('calling pgw');
            api.getPGWLink({
                data: {
                    customer_id: session.storage.customer.id,
                    package_id: subscription.selectedPack.id,
                },
                success: function (response) {
                    window.paymentMethod.paymentLink.pgw = response.invoice.paymentUrl
                    console.log('response',response,window.paymentMethod.paymentLink);
                    console.log('payment method',window.paymentMethod.allPaymentMode,window.paymentMethod.allPaymentMode[0])
                    window.paymentMethod.updateQRCodeText(window.paymentMethod.paymentLink[window.paymentMethod.allPaymentMode[0]]);
                }
            
            });
        }
        if(this.allPaymentMode.includes('nagad')){
            console.log('calling nagad');
            api.getNagadLink({
                data: {
                    customer_id: session.storage.customer.id,
                    package_id: subscription.selectedPack.id,
                },
                success: function (response) {
                    window.paymentMethod.paymentLink.nagad = response.invoice.paymentUrl
                    console.log('response',response,window.paymentMethod.paymentLink);
                    console.log('payment method',window.paymentMethod.allPaymentMode,window.paymentMethod.allPaymentMode[0])
                    window.paymentMethod.updateQRCodeText(window.paymentMethod.paymentLink[window.paymentMethod.allPaymentMode[0]]);

                }
            
            });
        }

        paymentMode.forEach(mode => {
            paymentMethod += `<div class="payment_mode">${mode}</div>`;
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
        console.log('session', api.customer);
        
        
        $("#subscription .payment-list").slick({
            vertical: true,
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
    keyDown: function (event) {
        switch (event.keyCode) {
            case tvKey.KEY_BACK:
            case 27:
                paymentMethod.destroy();
                break;
            case tvKey.KEY_UP:
                $("#subscription .payment-list")[0].slick.prev();
                this.selectedPaymentMode = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
                this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
                console.log('this up', this.selectedPaymentMode,this.paymentLink[this.selectedPaymentMode]);

                break;
            case tvKey.KEY_DOWN:
                $("#subscription .payment-list")[0].slick.next();
                this.selectedPaymentMode = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
                // this.updateQRCodeText("instagram.com");
                this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
                this.updateQRCodeText(this.paymentLink[this.selectedPaymentMode]);
                break;
            case tvKey.KEY_ENTER:
                var selectedPack = subscription.selectedPack;
                var item = this.allPaymentMode[$("#subscription .payment-list")[0].slick.currentSlide];
                console.log('all payment mode',item);
                this.selectedPaymentMode = item;
                console.log('payment mode',this.selectedPaymentMode);
                break;

        }
    },
    destroy: function () {
        console.log('destroy');
        $(`#${paymentMethod.id}`).remove();
        $("#subscription .content").show();
        main.state = paymentMethod.previous;
    },
    updateQRCodeText: function (paymentLink) {
        console.log('ami call hpcci');
        $("#payment-qr-code").empty();
        var newText = paymentLink;
        // Customize newText based on your requirements
        // For example, concatenate with this.selectedPaymentMode or any other logic
        var qrcode = new QRCode(document.getElementById('payment-qr-code'), {
            text: newText,
            width: 1024,
            height: 1024,
            colorDark: '#FFF',
            colorLight: '#000',
            correctLevel: QRCode.CorrectLevel.H
        });
    },
}