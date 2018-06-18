//= ../vendor/jquery/dist/jquery.min.js
//= ../js/navbar_fixed.js
//= ../vendor/bootstrap-sass/assets/javascripts/bootstrap.min.js
//= ../vendor/jquery-validation/dist/jquery.validate.min.js
//= ../vendor/jquery-validation-bootstrap-tooltip/jquery-validate.bootstrap-tooltip.min.js
//= ../vendor/jquery-mousewheel/jquery.mousewheel.min.js
//= ../vendor/slick-carousel/slick/slick.min.js
//= ../vendor/wow/dist/wow.min.js

class GG {
    init() {
        this
            .initWow()
            .footerToBottomPage()
            .loadYoutubeApi()
            .initSlick()
            .initValidation()
            .validInput()
            .initializeMap()
            .initReferentiesList()
            .initCoursesFilters()
            .filtersVisibleMobile()
            .initMobileMenu();
    }

    splashScreen(){
        if($('.splash-screen').length){
            if(window.innerWidth >=768){
                var marginleft = '-54px';
                var topEl = "29px";
            } else {
                var marginleft = '-54px';
                var topEl = "16px";
            }
            setTimeout(function(){
                $('#brand').animate({
                    'width': '108px',
                    'height': '73px',
                    'marginTop': 0,
                    'marginLeft': marginleft,
                    'top': topEl
                }, 600, function() {
                    $('.splash').fadeOut( "400", function() {
                        $('.splash-screen').removeClass('splash-screen');
                        $('#brand').css('width', '').css('height', '').css('margin-top', '').css('margin-left', '').css('top', '');
                    });
                });
            },2000)
        }
        return this;
    }

    initWow(){
        if($('.wow').length){
            new WOW().init();
        }
        return this;
    }

    footerToBottomPage(){
        var appGG = this;
        appGG.footerToBottomPageCSS();
        $(window).resize(function(){
            appGG.footerToBottomPageCSS();
        });
        return this;
    }

    footerToBottomPageCSS(){
        var heightFooter = $('footer').outerHeight();
        $('.layout').css('margin-bottom', -heightFooter);
        $('.both').css('height', heightFooter);
    }

    parallaxInit() {
        $('.parallax').stellar({
            scrollProperty: 'transform'
        });
        return this;
    }

    initSlick(){
        if($('.slick-full').length){
            var prev = $(this).closest('.slick-full-shell').find('.controls.slick-prev'),
                next = $(this).closest('.slick-full-shell').find('.controls.slick-next');
            $('.slick-full').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                prevArrow: '.slick-full-shell .controls.slick-prev',
                nextArrow: '.slick-full-shell .controls.slick-next',
            });
            $('.slick-full').on('beforeChange', function(event, slick, currentSlide, nextSlide){
                if($(this).closest('.testimonial').length){
                    $(this).find('.slick-item').css('opacity', 1);
                    $(this).find("[data-slick-index="+currentSlide+"]").animate({
                        opacity:0
                    }, 300, function(){
                        var elem = $(this);
                        setTimeout(function(){
                            elem.find('.slick-current').css('opacity', 1);
                        },600);
                    });
                }
            });

            $('.slick-full').on('afterChange', function(event, slick, currentSlide, nextSlide){
                if($(this).closest('.testimonial').length){
                    var elem = $(this);
                    // setTimeout(function(){
                        elem.find('.slick-current').css('opacity', 1);
                    // },300);
                }
            });
        }
        return this;
    }

    loadYoutubeApi(){
        // Inject YouTube API script
        var tag = document.createElement('script');
        tag.src = "//www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        return this;
    }

    initValidation() {
        var thisObj = this;
        let $form = $('#form');
        if($form.length) {
            $form.validate({
                debug: true,
                invalidHandler: function(event, validator) {
                    $('.empty').removeClass('empty');
                    for (var i=0;i<validator.errorList.length;i++){
                        $(validator.errorList[i].element).addClass('empty');
                    }
                },
                rules: {
                    telefoonnummer: {
                      required: true,
                      number: true
                    }
                },
                showErrors: function(errorMap, errorList) {
                    $.each(this.validElements(), function (index, element) {
                        var $element = $(element);
                        $element.tooltip("destroy");
                    });
                    $.each(errorList, function (index, error) {
                        var $element = $(error.element);
                        $element.tooltip("destroy");
                    });
                },
                submitHandler: function(form) {
                },
            });
        }
        return this;
    }

    validInput(){
        $('.form-control').each(function(){
            if($(this).val()!= ""){
                $(this).addClass('valid');
            }
        });

        $('.form-control').on('change', function(){
            if($(this).val()!= ""){
                $(this).addClass('valid').removeClass('empty');
            }
        });

        $("#telefoonnummer").keypress(function (e) {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        });
        return this;
    }

    initMobileMenu(){
        $('#bs-example-navbar-collapse-1').on('hidden.bs.collapse', function () {
            $('body').removeClass('open-menu');
        });
        $('#bs-example-navbar-collapse-1').on('shown.bs.collapse', function () {
            $('body').addClass('open-menu');
        });
        return this;
    }

    initializeMap(){
        if($('#map').length){
            var markerSize = {
                x: 51,
                y: 2
            };
            google.maps.Marker.prototype.setLabel = function(label) {
                this.label = new MarkerLabel({
                    map: this.map,
                    marker: this,
                    text: label
                });
                this.label.bindTo('position', this, 'position');
            };

            var MarkerLabel = function(options) {
                this.setValues(options);
                this.span = document.createElement('span');
                this.span.className = 'map-marker-label';
            };

            MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
                onAdd: function() {
                    this.getPanes().overlayImage.appendChild(this.span);
                    var self = this;
                    this.listeners = [
                        google.maps.event.addListener(this, 'position_changed', function() {
                            self.draw();
                        })
                    ];
                },
                draw: function() {
                    var text = String(this.get('text'));
                    var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
                    this.span.innerHTML = text;
                    this.span.style.left = (position.x + (markerSize.x / 2)) - (text.length) + 20 + 'px';
                    this.span.style.top = (position.y - markerSize.y + 24) + 'px';
                }
            });
            var styledMapType = new google.maps.StyledMapType(
            [
                {
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#000000"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#191919"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                 {
                    "featureType": "landscape.natural",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#d6d7d6"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#bfc3c1"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#babab3"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#babab3"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#a7b8b3"
                        }
                    ]
                }
            ],
            {name: 'Styled Map'});
            var mapOptions = {
                zoom: 14,
                center: new google.maps.LatLng(51.901671, 4.331942),
                mapTypeControlOptions: {
                    // mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
                    mapTypeIds: []
                }
            }
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

            var pinColor = "5a4258";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(2, 2)); 
            var myLatLng = new google.maps.LatLng(51.901671, 4.331942);
            var Marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: pinImage,
                draggable: true,
                label: "ESD Systeemwanden B.V."
            });
            //Associate the styled map with the MapTypeId and set it to display.
            map.mapTypes.set('styled_map', styledMapType);
            map.setMapTypeId('styled_map');
        }
        return this;
    }

    static referentiesList() {
        var url = '/referenties.json';
        const referentiesList = [];
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(data) {
                for (var i=0; i < data.referenties.length; i++) {
                    referentiesList.push(data.referenties[i]);
                }
                
            },
            error: function(e) {
            }
        });
        return referentiesList;
    }

    initReferentiesList(els) {
        if($('#referenties-lists').length){
            if (els) {
                let markup = '';
                if(els.length) {
                    for(let i = 0; i < els.length; i++) {
                        markup += `
                            <li data-type="${els[i].type}" style="opacity:0;">
                                <div class="referenties-inner">
                                    <a href="${els[i].url}">
                                        <span class="referenties-img" style="background-image: url(static/images/referenties/${els[i].img})">
                                        </span>
                                    </a>

                                    <div class="referenties-info">
                                        <a href="${els[i].url}">
                                            <span class="referenties-name">
                                                ${els[i].title}
                                            </span>
                                        </a>
                                        <div class="referenties-description">
                                            ${els[i].location}
                                        </div>
                                    </div>
                                    <div class="referenties-btn">
                                        <a href="${els[i].url}" class="btn btn-outline">Bekijk dit project</a>
                                    </div>
                                </div>
                            </li>
                        `;
                    }
                }
                $('#referenties-lists').html('');
                $('#referenties-lists').html(markup);
                $('.referenties-lists li').animate({
                    opacity: 1
                }, 400);
            } else {
                let elems = GG.referentiesList();
                let markup = '';
                for(let i = 0; i < elems.length; i++) {
                    markup += `
                        <li data-type="${elems[i].type}">
                            <div class="referenties-inner">
                                <a href="${elems[i].url}">
                                    <span class="referenties-img" style="background-image: url(static/images/referenties/${elems[i].img})">
                                    </span>
                                </a>

                                <div class="referenties-info">
                                    <a href="${elems[i].url}">
                                        <span class="referenties-name">
                                            ${elems[i].title}
                                        </span>
                                    </a>
                                    <div class="referenties-description">
                                        ${elems[i].location}
                                    </div>
                                </div>
                                <div class="referenties-btn">
                                    <a href="${elems[i].url}" class="btn btn-outline">Bekijk dit project</a>
                                </div>
                            </div>
                        </li>
                    `;
                }
                $('#referenties-lists').html(markup);
            }
        }
        return this;
    }

    initCoursesFilters() {
        let $filters = $('.filters');
        let that = this;

        function capitalize(s)
        {
            return s && s[0].toUpperCase() + s.slice(1);
        }
        if ($filters.length) {
            function checkCallback(target) {
                $('.filter-active').removeClass('filter-active');
                $(target).closest('li').addClass('filter-active');

                let typeFilter = $(target).data('filter');
                let elems = GG.referentiesList();
                let filteredEls = elems;

                if(typeFilter != "alles"){
                    filteredEls = filteredEls.filter(function (element) {
                        return element.type === typeFilter;
                    });
                }
                that.initReferentiesList(filteredEls);
            }
            $filters.on('click', '.filter-item', function(e){
                e.preventDefault();
                var element = this;
                if($(this).closest('.filter-open').hasClass('filter-open')){
                    $('.filter-open').removeClass('filter-open');
                    var wrapper = $(this).closest('.filter-shell'),
                        htmlActiveFilter = $(this).html();
                    wrapper.find('.filters-lists-inner').animate({
                        height: 0
                    },400);

                    wrapper.find('.filter-active-mobile').html(htmlActiveFilter).animate({
                        opacity: 1
                    },400);

                    wrapper.find('.filter-lists li').animate({
                        opacity: 0
                    }, 400);
                }
                checkCallback(element);
            });
        }
        return this;
    }

    filtersVisibleMobile(){
        if(window.innerWidth<768){
            $('.filters').on('touchstart', function(){
                if(!$(this).hasClass('filter-open')){
                    var wrapper = $(this).closest('.filter-shell');
                    $(this).find('.filter-active-mobile').animate({
                        opacity: 0
                    },400, function(){
                        wrapper.find('.filters-lists-inner').animate({
                            height: wrapper.find('.filter-lists').outerHeight()
                        },400);
                        setTimeout(function(){
                            wrapper.find('.filter-lists li').animate({
                                opacity: 1
                            }, 400);
                        },400);
                    });
                    $(this).addClass('filter-open');
                }
            });
        }
        $(window).resize(function(){
            if(window.innerWidth > 767){
                $('.filter-active-mobile').css('opacity', '');
                $('.filters-lists-inner').css('height', '');
                $('.filter-lists li').css('opacity', '');
            }
        });
        return this;
    }
}

$(function () {
    $(document).ready(function () {
        let APP = new GG();
        APP.init();
    });
});