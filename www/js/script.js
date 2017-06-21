//document.addEventListener('deviceready', function(){
$(document).ready(function(){

	var app_url	= "http://www.zeisscalc.com.br/";

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(function(){
		var markup_chart = new google.visualization.SteppedAreaChart(document.getElementById('markup_chart'));
		markup_chart.draw(google.visualization.arrayToDataTable([
			['',  'Médio Cliente', 'Médio Zeiss'],
			['Markup', 3, 4]
		]), {
			isStacked: false,
			width:$(window).width(),
			legend: { position: 'top' },
			colors: ['#000000', '#53A8FB']
		});
		
		var custo_chart = new google.visualization.SteppedAreaChart(document.getElementById('custo_chart'));
		custo_chart.draw(google.visualization.arrayToDataTable([
			['',  'Médio Cliente', 'Médio Zeiss'],
			['Custo', 155, 127]
		]), {
			isStacked: false,
			width:$(window).width(),
			legend: { position: 'top' },
			colors: ['#000000', '#53A8FB']
		});
	});
	
	UIkit.tab($("#switcher_menu"), {});
	
	/* App login */
	$(document).on("submit", ".login_form", function(){
		var thisForm	= $(this);
		$.ajax({
			url:app_url,
			type:"POST",
			data:$(thisForm).serialize(),
			dataType:"JSON",
			beforeSend:function(){
				$(thisForm).find("input, button").prop({disabled:true});
				$(".btn_login_form").find("div").removeClass("uk-hidden").end().find("span").html(" CARREGANDO..");
			}
		}).done(function(data){
			console.log(data);
			if(Number(data)>0){
				$(".zeiss_login").stop().fadeOut(250, function(){
					$(".app").stop().fadeIn(250);
				});
			}else{
				UIkit.notification('Login ou senha incorretos, por favor tente novamente.', 'danger');
				$(thisForm).find("input, button").prop({disabled:false});
				$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
			}
		}).fail(function(){
			UIkit.notification('Ocorreu um erro ao fazer o login, por favor tente novamente.', 'danger');
			$(thisForm).find("input, button").prop({disabled:false});
			$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
		});
		return false;
	});
});
//}, false);
