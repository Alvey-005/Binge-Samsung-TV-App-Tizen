window.networkToaster = {
    id: 'networkToaster',
    toasterTimer: NaN,
    init: function(){

        var networkToasterElement = document.createElement('div');
        networkToasterElement.id = networkToaster.id;
        networkToasterElement.className = 'toaster';
        document.body.appendChild(networkToasterElement);
    },
    show: function(showText='You are currently offline'){
        var toaster = document.getElementById(networkToaster.id);
        toaster.innerText= showText;
        toaster.style.display = 'block';
    },
    hide: function(){
        var toaster = document.getElementById(networkToaster.id);
        toaster.style.display = 'none';
        clearTimeout(networkToaster.toasterTimer);
    },
    destroy: function () {
        document.getElementById(this.id) && document.body.removeChild(document.getElementById(this.id));
    }
}