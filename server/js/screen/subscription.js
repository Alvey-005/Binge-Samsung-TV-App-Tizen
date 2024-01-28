window.subscription = {
    id: 'subscription',
    previous: null,
    selected: false,
    packages: null,
    selectedPack : null,

    init: function () {

        var subscription_element = document.createElement('div');
        subscription_element.className = 'subscription';
        subscription_element.innerHTML = `
        <div class="content">
        <div class="subscription-title">Subscription</div>
        <div class="subscription-packages"></div>
        </div>
        `;
        subscription_element.id = subscription.id;
        document.body.appendChild(subscription_element);
        subscription.load();

        // console.log('hello',packages_html);
    },
    start: function () {
        api.getSubscription({
            success: function (subs) {
                console.log(subs);
                subscription.packages = subs.packages;
                console.log(subs.packages, subscription);
                subscription.init();
            }
        })
    },
    packageClick: function(event, index) {
      console.log(index);
      console.log(subscription.packages[index]);
      $("#subscription .subscription-packages")[0].slick.slickGoTo(index);
    },
    destroy: function () {
        document.body.removeChild(document.getElementById(subscription.id));
    },
    load: function () {

        var packages_html = "";
        var i = 1;
        console.log('len', subscription.packages.length);
        subscription.packages.forEach((pack, index) => {
            packages_html +=
                `<div class='package' onclick="subscription.packageClick(event, '${index}')")">
                <div class='package-description'>
                  <div class='package-price margin-right-40'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="32" viewBox="0 0 27 32" fill="none">
                      <path d="M5.16582 0C6.50749 0 7.55823 0.559424 8.31843 1.67748C9.12351 2.7505 9.57073 4.22634 9.66041 6.10483V13.1488H11.5389L14.6918 16.3692H9.66041V25.4927C9.66041 26.2082 9.92867 26.8566 10.4651 27.4382C11.0019 28.0199 11.8742 28.3103 13.0819 28.3102C14.6472 28.3103 16.3021 27.4382 18.0461 25.6942C19.8348 23.9049 20.7741 22.0716 20.8637 20.1932L20.0587 20.2598C17.1964 20.2598 15.7649 18.7394 15.7649 15.698C15.7649 14.6692 16.1005 13.7527 16.7714 12.9478C17.4426 12.1427 18.5603 11.7402 20.1257 11.7402C21.7806 11.7402 23.167 12.4556 24.2852 13.8867C25.4482 15.3181 26.0297 17.0623 26.0297 19.1193C26.0297 22.1608 24.7322 25.068 22.1383 27.8408C19.5891 30.6136 16.5475 32 13.0146 32C11.7178 32.0002 10.3312 31.441 8.85518 30.3232C7.42398 29.1599 6.5745 28.0417 6.30608 26.9687V16.3692H3.0856L0 13.1488H6.30608V6.77598C6.30608 5.47872 5.52344 4.71844 3.95785 4.49483C3.24229 4.49483 2.77294 4.60656 2.54909 4.83033C2.14675 4.15917 1.76645 3.35433 1.40867 2.41516V2.07967C1.40867 1.49843 1.85606 1.00633 2.75042 0.60383C3.64511 0.201329 4.45019 0 5.16582 0Z" fill="white" />
                    </svg>
                    <div class='package-price-text'>${pack.display_amount}</div>
              
                  </div>
                  <div class='package-details'>
                    <div class="package-title mb-20">${pack.title}</div>
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
                      <div class="package-subtitle ml-20">${pack.device_stream_details} </div>
                    </div>
              
                  </div>
              
                </div>
                <div class='package-validity'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="168" height="179" viewBox="0 0 168 179" fill="none">
                    <path d="M55.2441 5.80607L55.2443 5.80616L102.087 32.3167L148.93 58.8271C148.93 58.8271 148.93 58.8272 148.93 58.8272C173.024 72.4683 173.023 106.543 148.93 120.173L148.93 120.173L102.087 146.683L55.2443 173.194L55.2441 173.194C31.1117 186.857 1 169.758 1 142.521V89.5105V89.4895V36.479C1 9.2416 31.1117 -7.85706 55.2441 5.80607Z" stroke="#FF1A00" stroke-width="2" />
              
                  </svg>
                  <span class='package-validity-title'>${pack.no_of_validity_days} days</span>
              
                </div>
              </div>`
                i+=1;
        });
        for (var index = 0; index < 6; index++) {
            packages_html += `
            <div class="episode">
              <div class="episode-image">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
              </div>
            </div>`;
          }
        $("#subscription .subscription-packages").eq(0).html(packages_html);
        $("#subscription .subscription-packages").slick({
            vertical: true,
            dots: false,
            arrows: false,
            infinite: false,
            slidesToShow: this.packages && subscription.packages.length,
            slidesToScroll: 1,
            speed: 0,
            waitForAnimate: false,
            cssEase: 'ease-in-out'
        });

        $("#subscription .subscription-packages")[0].slick.slickGoTo(0);
    },
    keyDown: function (event) {
        switch (event.keyCode) {
            case tvKey.KEY_BACK:
            case tvKey.KEY_ESCAPE:
            case tvKey.KEY_LEFT:
                menu.open();
                break;
            case tvKey.KEY_UP:
                $("#subscription .subscription-packages")[0].slick.prev();
                break;
            case tvKey.KEY_DOWN:
                $("#subscription .subscription-packages")[0].slick.next();
                break;
            case tvKey.KEY_ENTER:
                var item = subscription.packages[$("#subscription .subscription-packages")[0].slick.currentSlide];
                this.selectedPack = item;
                paymentMethod.init();
                break;
        }
    },
    move: function (event) {

    },
    action: function (event) {

    }
}