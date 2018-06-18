$(document).ready(function(){
    var myNavBar = {
        flagAdd: true,

        elements: [],

        init: function (elements) {
            this.elements = elements;
        },

        add : function() {
            if(this.flagAdd) {
                if(window.innerWidth > 767){
                    for(var i=0; i < this.elements.length; i++) {
                        document.getElementById(this.elements[i]).className += " fixed-theme";
                        $('.fixed-theme').animate({
                            top: 0
                        }, 400);
                    }
                }
                this.flagAdd = false;
            }
        },

        remove: function() {
            if(window.innerWidth > 767){
                for(var i=0; i < this.elements.length; i++) {
                    $('.fixed-theme').css('top', '').removeClass('fixed-theme');
                }
            }
            this.flagAdd = true;
        }

    };

    myNavBar.init(  [
        "header",
    ]);

    function offSetManager(){

        var yOffset = 101;
        var yEndMenu = 101;
        var currYOffSet = window.pageYOffset;

        if(yOffset < currYOffSet) {
            myNavBar.add();
        }
        else if(currYOffSet <= yOffset){
            myNavBar.remove();
        }

    }

    window.onscroll = function(e) {
        offSetManager();
    }

    offSetManager();
});