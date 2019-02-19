//上传文件到本地服务器
var upLoadFun = {
    //上传一张图片
    uploadPic : function(){
        var self = this;
        var $Form_1 = $('#Form_1');

        $Form_1.ajaxForm(function() {});

        $("#inupf_1").change(function(){
            $('#Form_1').submit();
        });

        $Form_1.submit(function(){
            $(this).ajaxSubmit(self.options_1);
            return false;
        });
    },

    options_1 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: goodsClassificationCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic2 : function(){
        var self = this;
        var $Form_2 = $('#Form_2');

        $Form_2.ajaxForm(function() {});

        $("#inupf_2").change(function(){
            $('#Form_2').submit();
        });

        $Form_2.submit(function(){
            $(this).ajaxSubmit(self.options_2);
            return false;
        });
    },

    options_2 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: brandManageCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    //postGoods-pics
    uploadPic3 : function(){
        var self = this;
        var $Form_3 = $('#Form_3');

        $Form_3.ajaxForm(function() {});

        $("#inupf_3").change(function(){
            $('#Form_3').submit();
        });

        $Form_3.submit(function(){
            $(this).ajaxSubmit(self.options_3);
            return false;
        });
    },

    options_3 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: postGoodsCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic4 : function(){
        var self = this;
        var $Form_4 = $('#Form_4');

        $Form_4.ajaxForm(function() {});

        $("#inupf_4").change(function(){
            $('#Form_4').submit();
        });

        $Form_4.submit(function(){
            $(this).ajaxSubmit(self.options_4);
            return false;
        });
    },

    options_4 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: postGoodsCtrl.showResponse_2,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic5 : function(){
        var self = this;
        var $Form_5 = $('#Form_5');

        $Form_5.ajaxForm(function() {});

        $("#inupf_5").change(function(){
            $('#Form_5').submit();
        });

        $Form_5.submit(function(){
            $(this).ajaxSubmit(self.options_5);
            return false;
        });
    },

    options_5 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: postModalCtr.showResponse_3,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic6 : function(){
        var self = this;
        var $Form_6 = $('#Form_6');

        $Form_6.ajaxForm(function() {});

        $("#inupf_6").change(function(){
            $('#Form_6').submit();
        });

        $Form_6.submit(function(){
            $(this).ajaxSubmit(self.options_6);
            return false;
        });
    },

    options_6 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: homeBannerCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic7 : function(){
        var self = this;
        var $Form_7 = $('#Form_7');

        $Form_7.ajaxForm(function() {});

        $("#inupf_7").change(function(){
            $('#Form_7').submit();
        });

        $Form_7.submit(function(){
            $(this).ajaxSubmit(self.options_7);
            return false;
        });
    },

    options_7 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: homeBannerCtrl.showResponse_2,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic8 : function(){
        var self = this;
        var $Form_8 = $('#Form_8');

        $Form_8.ajaxForm(function() {});

        $("#inupf_8").change(function(){
            $('#Form_8').submit();
        });

        $Form_8.submit(function(){
            $(this).ajaxSubmit(self.options_8);
            return false;
        });
    },

    options_8 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: homeActiveCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic9 : function(){
        var self = this;
        var $Form_9 = $('#Form_9');

        $Form_9.ajaxForm(function() {});

        $("#inupf_9").change(function(){
            $('#Form_9').submit();
        });

        $Form_9.submit(function(){
            $(this).ajaxSubmit(self.options_9);
            return false;
        });
    },

    options_9 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: homeActiveCtrl.showResponse_2,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic10 : function(){
        var self = this;
        var $Form_10 = $('#Form_10');

        $Form_10.ajaxForm(function() {});

        $("#inupf_10").change(function(){
            $('#Form_10').submit();
        });

        $Form_10.submit(function(){
            $(this).ajaxSubmit(self.options_10);
            return false;
        });
    },

    options_10 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: homeBoutiqueCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic11 : function(){
        var self = this;
        var $Form_11 = $('#Form_11');

        $Form_11.ajaxForm(function() {});

        $("#inupf_11").change(function(){
            $('#Form_11').submit();
        });

        $Form_11.submit(function(){
            $(this).ajaxSubmit(self.options_11);
            return false;
        });
    },

    options_11 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: floorActiveCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic12 : function(){
        var self = this;
        var $Form_12 = $('#Form_12');

        $Form_12.ajaxForm(function() {});

        $("#inupf_12").change(function(){
            $('#Form_12').submit();
        });

        $Form_12.submit(function(){
            $(this).ajaxSubmit(self.options_12);
            return false;
        });
    },

    options_12 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: floorActiveCtrl.showResponse_2,
        resetForm: true,
        dataType:  'json'
    },

    uploadPic13 : function(){
        var self = this;
        var $Form_13 = $('#Form_13');

        $Form_13.ajaxForm(function() {});

        $("#inupf_13").change(function(){
            $('#Form_13').submit();
        });

        $Form_13.submit(function(){
            $(this).ajaxSubmit(self.options_13);
            return false;
        });
    },

    options_13 : {
        url: dataApi.API_UPLOAD_IMAGE,
        success: announceCtrl.showResponse_1,
        resetForm: true,
        dataType:  'json'
    }




};
