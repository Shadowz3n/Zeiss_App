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
			isStacked: false
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
	
	$.calc	= function(){
		var sugestao_custo	= 0, sugestao_venda	= 0;
		var zeiss_custo	= 0, zeiss_venda = 0;
		$(".table_sugestao").find("tbody").find("tr").each(function(){
			sugestao_custo	+= Number($(this).find("td").eq(1).html().replace(",", ".")) * Number($(this).find("td").eq(2).html().replace(",", "."));
			sugestao_venda	+= Number($(this).find("td").eq(1).html().replace(",", ".")) * Number($(this).find("td").eq(3).html().replace(",", "."));
		});
		$(".table_zeiss").find("tbody").find("tr").each(function(){
			zeiss_custo	+= Number($(this).find("td").eq(1).html().replace(",", ".")) * Number($(this).find("td").eq(2).html().replace(",", "."));
			zeiss_venda	+= Number($(this).find("td").eq(1).html().replace(",", ".")) * Number($(this).find("td").eq(3).html().replace(",", "."));
		});
		
		var lucro_mensal	= ((zeiss_venda-zeiss_custo) - (sugestao_venda-sugestao_custo));
			lucro_anual		= lucro_mensal*12;
			
		$("#economia_mensal").html(lucro_mensal.toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }));
		$("#economia_anual").html(lucro_anual.toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }));
	}
	
	$.calc();
	
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
