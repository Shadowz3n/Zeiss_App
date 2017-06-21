//document.addEventListener('deviceready', function(){
$(document).ready(function(){

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(function(){
		var chart = new google.visualization.SteppedAreaChart(document.getElementById('markup_chart'));
		chart.draw(google.visualization.arrayToDataTable([
			['',  'Médio Cliente', 'Médio Zeiss'],
			['Markup', 3, 7]
		]), {
			title: '', 
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
			url:document.location.href,
			type:"POST",
			data:$(thisForm).serialize(),
			beforeSend:function(){
				$(thisForm).find("input, button").prop({disabled:true});
				$(".btn_login_form").find("div").removeClass("uk-hidden").end().find("span").html(" CARREGANDO..");
			}
		}).done(function(data){
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
