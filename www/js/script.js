//document.addEventListener('deviceready', function(){
$(document).ready(function(){

	var app_url	= "http://www.zeisscalc.com.br/";

	google.charts.load('current', {'packages':['bar']});
	
	google.charts.setOnLoadCallback(function(){
		var chart = new google.charts.Bar(document.getElementById('markup_chart'));
		chart.draw(google.visualization.arrayToDataTable([
			['Markup', 'Médio Zeiss', 'Médio Cliente'],
			['Markup', 4, 3]
		]), google.charts.Bar.convertOptions({
			width: $(window).width()-35,
			legend:{position:'left',alignment:'start'},
			isStacked: true
		}));
		
		var chart = new google.charts.Bar(document.getElementById('custo_chart'));
		chart.draw(google.visualization.arrayToDataTable([
			['Zeiss', 'Médio Zeiss', 'Médio Cliente'],
			['Zeiss', 127, 155]
		]), google.charts.Bar.convertOptions({
			width: $(window).width()-35,
			legend:{position:'left',alignment:'start'},
			isStacked: false
		}));
	});//#53A8FB
	
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
					$(".login_form").find("input, button").prop({disabled:false});
					$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
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
	}).on("click", ".exit_app", function(){
		$(".app").stop().fadeOut(250, function(){
			$(".zeiss_login").stop().fadeIn(250);
		});
		$("#offcanvas-nav").click();
		return false;
	});
});
//}, false);
