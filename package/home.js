$(function(){

    for(var i = 1; i <= 15; i++){
        $("#home_" + i).fadeIn();
        $(".levelPermiss").fadeIn();
    }
    var adminType = localStorage.getItem(strKey.KAdminType);
    if(adminType == "0")
    {
        $("#home_8").hide();//提现管理
        $("#home_1").hide();//超级管理员
    }else
    {
        $("#home_11").hide();//普通管理员
    }
});

var homeParams = {
	nav : $(".nav div"),
	navItem : "nav_menu",
	navItemActive : "nav_act",
	secNav : $(".nav_content li")
};

homeParams.nav.on("click",function(){
	$(this).attr("class",homeParams.navItemActive).siblings("div").attr("class",homeParams.navItem);
	if($(this).next(".nav_content").css("display")=="none"){
		$(this).siblings("div").find(".icon").attr("class","icon-angle-right icon");
		$(this).find(".icon").attr("class","icon-angle-down icon")
	}
	else{
		$(this).find(".icon").attr("class","icon-angle-right icon")
	}
	$(this).next(".nav_content").slideToggle(200).siblings(".nav_content").slideUp(200);
});

homeParams.secNav.on("click",function(){

	$(this).next(".nav_content_sec").slideToggle(200).siblings(".nav_content_sec").slideUp(200);
});

$(".logout_container").on("click",function(){
	var dropDownMenu = $(".dropdown_menu");

    $(".logout-container-tips").removeClass("logout-container-tips-active");
    $(".dropdown-menu-tips").hide().removeClass("animated fadeInUp");

	if(dropDownMenu.css("display") == "none")
	{
		$(this).addClass("logout_active");
		dropDownMenu.show().addClass("animated fadeInUp");
	}
	else
	{
		$(this).removeClass("logout_active");
		dropDownMenu.hide().removeClass("animated fadeInUp")
	}
});

$(".logout-container-tips").on("click",function(){
	var dropDownMenuTips = $(".dropdown-menu-tips");

    $(".logout_container").removeClass("logout_active");
    $(".dropdown_menu").hide().removeClass("animated fadeInUp");

	if(dropDownMenuTips.css("display") == "none")
	{
		$(this).addClass("logout-container-tips-active");
        dropDownMenuTips.show().addClass("animated fadeInUp");
	}
	else
	{
		$(this).removeClass("logout-container-tips-active");
        dropDownMenuTips.hide().removeClass("animated fadeInUp");
	}
});

$(".dropdown-menu-tips ul li ").on("click", function(){
    $(".logout-container-tips").removeClass("logout-container-tips-active");
    $(".dropdown-menu-tips").hide().removeClass("animated fadeInUp");
});

$(".menu").on("click",function(){
	if($(".left_side").width() > 0)
	{
		$('.left_side').css('width','0px');
		$('.right_side').css('margin-left','0px');
	}
	else
	{
		$('.left_side').css('width','230px');
		$('.right_side').css('margin-left','230px');
	}
});

$("#logout").on("click",function(){
	location.href = "login.html";
});