$(function(){
    "use strict";

    function showOverlay(show){
        if (show) {
            $('.oe-mktng-demo-overlay').animate({left:0},1200,'swing');
            $('.oe-mktng-demo-toolbar').animate({opacity:0},500,'swing',function(){
                $('.oe-mktng-demo-toolbar').hide();
            });
        } else {
            $('.oe-mktng-demo-overlay').animate({left:-1400},1500,'swing');
            $('.oe-mktng-demo-toolbar').show().animate({opacity:1},500,'swing');
        }
    }
    window.showOverlay = showOverlay;


    function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                            r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
        } : null;
    }

    function clerp(c1,c2,f) {
        var nf = 1.0 - f;
        c1 = hexToRgb(c1);
        c2 = hexToRgb(c2);
        return rgbToHex(
            Math.round(c1.r * nf + c2.r * f),
            Math.round(c1.g * nf + c2.g * f),
            Math.round(c1.b * nf + c2.b * f));
    }

    function grad(c1,c2,count){
        var cols = [];
        for (var i = 0; i <= count; i++) {
            cols.push(clerp(c1,c2,i/count));
        }
        return cols;
    }

    function cssGrad(c1,c2,dir) {
        var grad = "linear-gradient("+(dir || "to bottom")+","+c1+","+c2+")"
        console.log(grad);
        return grad;
    }


    function Pos3D(target, opts){
        opts = opts || {};

        this.target = target;
        this.width  = opts.width  || $(target).innerWidth();
        this.height = opts.height || $(target).innerHeight();
        this.debug  = !!opts.debug;
        this.floorwidth  = opts.floorwidth  || 512;
        this.floorheight = opts.floorheight || 512;
        this.angle = opts.angle || 45;
        this.url = opts.url || 'http://localhost:8069/pos/web/';
        this.state = 'start';

        DivSugar.NUM_OF_DIGITS = 8;

        this.scn = new DivSugar.Scene()
            .setSize(this.width, this.height)
            .adjustLayout($(target).innerWidth(),$(target).innerHeight(),'contain')
            .setImage(opts.background || 'rgba(0,0,0,0)')
            .setViewAngle(this.angle)
            .appendTo(target);

        this.models = {};
        this.tasks  = {};


        // -- the pos ipad template

        this.template = "<div class='oe-ipad-screen'>"+
            "<div class='oe-ipad-screen-overlay'></div>"+
            "<iframe class='oe-ipad-iframe' width=1024 height=768 src='" + this.url +"'></iframe>"+
            "</div>";
        
        // -- Create the floor

        this.models.floor = new DivSugar.Node()
            .setSize(this.floorwidth, this.floorheight)
            .setPosition(this.width/2, this.height*1, -this.floorheight*3/4)
            .rotate(90,0,0)
            .appendTo(this.scn);

        // -- Animate the floor appearance

        $(this.target).css({opacity:0}).animate({opacity:1},1000);

        // -- Animate the screen appearance

        setTimeout(function(){
            $('.oe-ipad-screen-overlay').animate({opacity:0},500);
        },500);

        // -- Resize The Viewport

        function resize() {
            console.log('resize');
            pos.scn.adjustLayout($(pos.target).innerWidth(),$(pos.target).innerHeight(),'contain')
        }
        
        window.addEventListener('resize', resize, true);

        // -- remove overlay when clicked

        var self = this;
        $('.oe-mktng-demo-overlay').click(function(){
            self.transition('zoom');
        });
        
        // -- reset overlay when 'Back' clicked
        
        $('.oe-mktng-demo .label-close').click(function(){
            self.transition('start');
        });

        // -- go fullscreen when 'Go Fullscreen' clicked

        $('.oe-mktng-demo .label-fullscreen').click(function(){
            self.fullscreen(true);
        });

        $('.oe-mktng-demo-exit-fullscreen').click(function(){
            self.fullscreen(false);
        });

        // -- Add an iPad --

        var cols = grad('#B4B6BD', '#E8EAEF', 4);
        this.createModel('ipad', { 
            pos:   [350,-100, 50],
            size:  [250, 250],
            rot:   [0,0,30],
            prescale: [3,3,3],
            scale: [2.7,2.7,2.7],
            faces: [
                { size: [400, 400], opacity:0.5, pos:[-200, -200,           -1           ], rad:[0,0,0,0], rot:[0,  0,0], bg:'/img/shade.png' },
                { size: [200, 110], opacity:1, pos:[-100, -50,            0            ], rad:[5,5,0,0], rot:[0,  0,0], bg: cols[0]},
                { size: [200, 4  ], opacity:1, pos:[-100,  59.7,          0            ], rad:[0,0,0,0], rot:[27, 0,0], bg: cssGrad(cols[0],cols[1])},
                { size: [200, 4  ], opacity:1, pos:[-100,  62.9967241395, 1.67976484904], rad:[0,0,0,0], rot:[54, 0,0], bg: cssGrad(cols[1],cols[2]) },
                { size: [200, 4  ], opacity:1, pos:[-100,  65.171529573,  4.67312772822], rad:[0,0,0,0], rot:[81, 0,0], bg: cssGrad(cols[2],cols[3]) },
                { size: [200, 4  ], opacity:1, pos:[-100,  65.7503370936, 8.32757458843], rad:[0,0,0,0], rot:[108,0,0], bg: cssGrad(cols[3],cols[4]) },
                { size: [200, 162], opacity:1, pos:[-100,  64.6069742144, 11.8464836987], rad:[0,0,5,5], rot:[135,0,0], bg: '/img/stand-front.png', },
                { size: [196, 142], opacity:1, pos:[ -98,  55.2145860589, 20.0388718541], rad:[3,3,3,3], rot:[135,0,0], bg:'#444' },
                { size: [160, 123], opacity:1, pos:[-80,   -36.802188714, 114.255646627], rad:[0,0,0,0], rot:[-45,0,0], /*bg: '/img/pos.jpg',*/ html: this.template },
            ],
        }).appendTo(this.models.floor);

        // -- Rotate the iPad --
        
        this.rotateIpad(true);
    };

    Pos3D.prototype = {

        rotateIpad: function(rotate) {
            var self = this;

            if (rotate) {
                if (this.tasks.rotate) {
                    return;
                }
                this.tasks.rotate = this.models.ipad.playAnimation([
                    ['to', { rotation: [0,0,45] }, 10000, DivSugar.Ease.quadInOut ],
                    ['call', function() {
                        self.tasks.rotate.active = false;
                        self.tasks.rotate = self.models.ipad.playAnimation([
                                ['to', { rotation: [0,0,15] }, 20000, DivSugar.Ease.quadInOut ],
                                ['to', { rotation: [0,0,45] }, 20000, DivSugar.Ease.quadInOut ],
                                ['repeat'],
                            ]);
                    }]
                ]);
            } else if (this.tasks.rotate) {
                this.tasks.rotate.active = false;
                delete this.tasks['rotate'];
            }
        },

        buildBox: function(opts){
            var cols = grad(opts.dcol || '#FFFFFF', opts.lcol || '#000000',5);
            var sx = opts.boxsize[0] || 100;
            var hx = sx/2;
            var sy = opts.boxsize[1] || 100;
            var hy = sy/2;
            var sz = opts.boxsize[2] || 100;
            var hz = sz/2;
            var model = {
                pos:  opts.pos || [0,0,0],
                size: opts.size || [sx,sy],
                rot:  opts.rot || [0,0,0],
                prescale: opts.prescale || [1,1,1],
                faces: [],
            };

            if (opts.ground) {
                model.faces.push({ size:[sx*3,sy*3], opacity:0.7, rot:0, pos:[-sx*1.5,-sy*1.5,-sz / 2 - 1], bg:'/img/shade.png'});
            }

            cols[5] = opts.top    || cols[5];
            cols[0] = opts.bottom || cols[0];
            cols[3] = opts.front  || cols[3];
            cols[1] = opts.side   || cols[1];

            model.faces.push({ size:[sx, sy], bg:cols[5], pos:[-sx / 2, -sy / 2,  sz / 2], rot:0});
            model.faces.push({ size:[sz, sy], bg:cols[1], pos:[ sx / 2, -sy / 2,  sz / 2], rot:[0,  90,  0]});
            model.faces.push({ size:[sx, sy], bg:cols[0], pos:[ sx / 2, -sy / 2, -sz / 2], rot:[0,  180, 0]});
            model.faces.push({ size:[sz, sy], bg:cols[1], pos:[-sx / 2, -sy / 2, -sz / 2], rot:[0,  270, 0]});
            model.faces.push({ size:[sx, sz], bg:cols[3], pos:[-sx / 2, -sy / 2, -sz / 2], rot:[90,   0, 0]});
            model.faces.push({ size:[sx, sz], bg:cols[3], pos:[-sx / 2,  sy / 2,  sz / 2], rot:[-90,  0, 0]});

            return model;
        },

        showCashbox: function(show) {
            var self = this;
            if (!this.models.cashbox) {
                var model = this.buildBox({
                    pos:     [400,-200, -300],
                    boxsize: [70, 70, 25],
                    size:    [100, 100],
                    rot:     [-20,0,0],
                    prescale: [2,2,2],
                    dcol: '#9d9ea5', 
                    lcol: '#d6d8dd', 
                    ground: true,
                });
                this.createModel('cashbox', model).appendTo(this.models.floor);

                var model = this.buildBox({
                    pos:     [0,4,0],
                    boxsize: [64, 70, 20],
                    size:    [100, 100],
                    rot:     [-0,0,0],
                    prescale: [2,2,2],
                    dcol: '#B4B6BD', 
                    lcol: '#E8EAEF', 
                    top: '#666666',
                });

                this.createModel('cash', model).appendTo(this.models.cashbox);

            }
            if (show) {
                this.models.cashbox.playAnimation([
                    ['to', { position:[410,-200,325],  rotate:[0,0,45]}, 1000, DivSugar.Ease.quadInOut],
                    ['wait',200],
                    ['call', function(){
                        self.models.cash.playAnimation([['to', {position:[0,55,0]}, 350, DivSugar.Ease.quadInOut]]);
                    }],
                ]);
            } else {
                this.models.cashbox.playAnimation([
                    ['call', function(){
                        self.models.cash.playAnimation([['to', {position:[0,4,0]}, 150, DivSugar.Ease.quadInOut]]);
                    }],
                    ['to', { position:[400,-200,-300], rotate:[0,0,-45]}, 1000, DivSugar.Ease.quadInOut],
                ]);
            }
        },

        showPrinter: function(show) {
            var self = this;
            if (!this.models.printer) {
                this.createModel('printer',this.buildBox({
                    pos:     [400,-200, -300],
                    boxsize: [35, 40, 20],
                    size:    [100, 100],
                    rot:     [-20,0,0],
                    prescale: [2,2,2],
                    scale: [1.2,1.2,1.2],
                    dcol: '#393939', 
                    lcol: '#444444', 
                    ground: true,
                })).appendTo(this.models.floor);

                this.createModel('printerhead',this.buildBox({
                    pos:     [5,30,40],
                    boxsize: [25, 5, 5],
                    size:    [100, 100],
                    rot:     [0,0,0],
                    prescale: [2,2,2],
                    dcol: '#393939', 
                    lcol: '#444444', 
                    top:  '#333333',
                })).appendTo(this.models.printer);

                this.createModel('printercap',this.buildBox({
                    pos:     [-2.5,2.5,25],
                    boxsize: [40, 44, 16],
                    size:    [100, 100],
                    rot:     [-20,0,0],
                    prescale: [2,2,2],
                    dcol: '#414141', 
                    lcol: '#484848', 
                })).appendTo(this.models.printer);

                this.models.receipt = new DivSugar.Node()
                    .setSize(40,30)
                    .setImage('#FFFFFF')
                    .rotate(90,0,0)
                    .setPosition(-15,30,5)
                    .setOpacity(0)
                    .appendTo(this.models.printer);

                this.models.printer.scale(1.2,1.2,1.2);
            }
            if (show) {
                this.models.printer.playAnimation([
                    ['to', { position:[410,-200,75], rotate:[0,0,45]}, 1000, DivSugar.Ease.quadInOut],
                    ['wait',200],
                    ['call', function(){
                        self.models.receipt.setOpacity(1);
                        self.models.receipt.playAnimation([
                            ['to', {position:[-15,30,45]}, 350, DivSugar.Ease.quadInOut]
                        ]);
                    }],
                ]);
            } else {
                this.models.printer.playAnimation([['to', { position:[400,-200,-300], rotate:[0,0,-45]}, 1000, DivSugar.Ease.quadInOut]]);
            }
        },

        fullscreen: function(fullscreen){
            var self = this;
            if (fullscreen) {
                $('body').css({overflow:'hidden'});
                $('.oe-mktng-demo-fullscreen').show().animate({opacity:1},250,'swing',function(){
                    $('.oe-ipad-iframe')
                        .prependTo('.oe-mktng-demo-fullscreen')
                        .width(window.innerWidth)
                        .height(window.innerHeight);

                    setTimeout(function(){
                        $('.oe-mktng-demo-fullscreen-overlay').animate({opacity:0},500,'swing');
                    },500);
                });
            } else {
                $('.oe-mktng-demo-fullscreen-overlay').animate({opacity:1},500,'swing',function(){
                    $('.oe-ipad-iframe')
                        .width(1024)
                        .height(768)
                        .prependTo('.oe-ipad-screen')

                    setTimeout(function(){
                        $('.oe-mktng-demo-fullscreen').animate({opacity:0},250,'swing',function(){
                            $('body').css({overflow:'auto'});
                            $('.oe-mktng-demo-fullscreen').hide();
                        });
                    },500);
                });
            }
                        
        },

        transition: function(state) {
            var self = this;
            if (state === this.state) {
                return;
            } else if (state === 'zoom') {
                showOverlay(false);
                this.rotateIpad(false);
                if (this.tasks.ipad) { this.tasks.ipad.active = false; }
                this.tasks.ipad = this.models.ipad.playAnimation([
    
                        ['to', { position: [0,0,60], rotation: [-45, 0, 0], scale:[1.28,1.28,1.28]}, 1000, DivSugar.Ease.quadInOut],
                        ['wait', 150 ],
                        ['to', { translate: [-250,0,0] }, 500, DivSugar.Ease.quadInOut],
                        ['call', function() { self.showCashbox(true); }],
                        ['wait', 200 ],
                        ['call', function() { self.showPrinter(true); }],
                    ]);
            } else if(state === 'start') {
                if (this.tasks.ipad) { this.tasks.ipad.active = false; }
                this.tasks.ipad = this.models.ipad.playAnimation([
                        ['call', function(){ self.showPrinter(false); }],
                        ['wait', 200 ],
                        ['call', function(){ self.showCashbox(false); }],
                        ['wait', 500 ],
                        ['call', function(){ showOverlay(true); }],
                        ['to',{ rotation: [0, 0, 30], scale: [1/1.28, 1/1.28, 1/1.28], position: [350,-100, 50] }, 900],
                        ['call', function(){ self.rotateIpad(true); }],
                    ]);
            }
            this.state = state;
        },

        createModel: function(name, desc) {
            var node = new DivSugar.Node()
            if (desc.size) {
                node.setSize(desc.size[0], desc.size[1]);
            }

            if (desc.pos) {
                node.setPosition(desc.pos[0], desc.pos[1], desc.pos[2]);
            }

            if (desc.rot) {
                node.rotate(desc.rot[0], desc.rot[1], desc.rot[2]);
            }

            
            if (desc.scale) {
                if (desc.prescale) {
                    node.scale(desc.scale[0] / desc.prescale[0], desc.scale[1] / desc.prescale[1], desc.scale[2] / desc.prescale[2]);
                } else {
                    node.scale(desc.scale[0], desc.scale[1], desc.scale[2]);
                }
            }

            if (this.debug) {
                node.div.innerHTML = this.centeredDiv('yellow');
            }

            this.models[name] = node;
            node.faces = [];
            var psx   = desc.prescale ? desc.prescale[0] : 1;
            var psy   = desc.prescale ? desc.prescale[1] : 1;
            var psz   = desc.prescale ? desc.prescale[2] : 1;

            for (var i = 0; i < desc.faces.length; i++) {
                var fdesc = desc.faces[i];
                var face  = new DivSugar.Node()
                    .setImage(fdesc.bg)
                    .setSize(fdesc.size[0] * psx, fdesc.size[1] * psy)
                    .setPosition(fdesc.pos[0] * psx|| 0, fdesc.pos[1] * psy || 0, fdesc.pos[2] * psz || 0)
                    .rotate(fdesc.rot[0] || 0, fdesc.rot[1] || 0, fdesc.rot[2] || 0)
                    .setOpacity(fdesc.opacity || 1);

                if (fdesc.html) {
                    face.div.innerHTML = fdesc.html;
                }

                if (fdesc.rad) {
                    if (fdesc.rad instanceof Array) {
                        face.setRadius.apply(face,fdesc.rad);
                    } else {
                        face.setRadius(desc.rad);
                    }
                }

                node.faces.push(face);
                face.appendTo(node);
            }
            return node;
        },

        centeredDiv: function(bg) {
            return "<div style='position:absolute;box-sizing:border-box;width:100%;height:100%;top:-50%;left:-50%;"+
                   (bg ? "background: "+bg+";" : "") +
                   "'></div>";
        },
    };

    window.pos = new Pos3D($('.oe-mktng-demo')[0],{
        background: 'rgba(0,0,0,0)',
        width:  1200,
        height: 500,
        angle: 30,
    });
});
