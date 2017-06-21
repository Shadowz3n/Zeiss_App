//document.addEventListener('deviceready', function(){
$(document).ready(function(){

	var app_url	= "http://www.zeisscalc.com.br/", first_comparation=true, chart_markut, chart_zeiss;

	google.charts.load('current', {'packages':['bar']});
	
	google.charts.setOnLoadCallback(function(){
		chart_markut = new google.charts.Bar(document.getElementById('markup_chart'));
		chart_markut.draw(google.visualization.arrayToDataTable([
			['Markup', 'Médio Cliente', 'Médio Zeiss'],
			['Markup', 0, 0]
		]), google.charts.Bar.convertOptions({
			width: $(window).width()-35,
			legend:{position:'left',alignment:'start'},
			isStacked: false
		}));
		
		chart_zeiss = new google.charts.Bar(document.getElementById('custo_chart'));
		chart_zeiss.draw(google.visualization.arrayToDataTable([
			['Zeiss', 'Médio Cliente', 'Médio Zeiss'],
			['Zeiss', 0, 0]
		]), google.charts.Bar.convertOptions({
			width: $(window).width()-35,
			legend:{position:'left',alignment:'start'},
			isStacked: false
		}));
	});
	
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
		
		lucro_mensal	= ((zeiss_venda-zeiss_custo) - (sugestao_venda-sugestao_custo));
		lucro_anual		= lucro_mensal*12;
		lucro_sao_web	= lucro_anual*0.02;
		
		chart_sugestao	= (sugestao_venda*100)/sugestao_custo;
		chart_zeiss		= (zeiss_venda*100)/zeiss_custo;
		
		if(chart_markut){
			chart_markut.draw(google.visualization.arrayToDataTable([
				['Markup', 'Médio Cliente', 'Médio Zeiss'],
				['Markup', chart_sugestao, chart_zeiss]
			]), google.charts.Bar.convertOptions({
				width: $(window).width()-35,
				legend:{position:'left',alignment:'start'},
				isStacked: false
			}));
		}
		
		$("#economia_mensal").html(lucro_mensal.toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }));
		$("#economia_anual").html(lucro_anual.toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }));
		$("#economia_sao_web").html(lucro_sao_web.toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }));
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
				window.localStorage.user_id	= Number(data);
				$(".zeiss_login").stop().fadeOut(250, function(){
					$(".app").stop().fadeIn(250);
					$(".login_form").find("input, button").prop({disabled:false});
					$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
				});
			}else{
				UIkit.notification('Login ou senha incorretos, por favor tente novamente.', 'danger');
				$(thisForm).find("input, button").prop({disabled:false});
				$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
				window.localStorage.removeItem("user_id");
			}
		}).fail(function(){
			UIkit.notification('Ocorreu um erro ao fazer o login, por favor tente novamente.', 'danger');
			$(thisForm).find("input, button").prop({disabled:false});
			$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
		});
		return false;
	}).on("submit", ".add_comparation_form", function(){
		if(first_comparation){
			first_comparation	= false;
			$(".table_sugestao").find("tbody").html("");
			$(".table_zeiss").find("tbody").html("");
		}
		var lineTable_sugestao	= '<tr>';
		$("#add_comparation_modal").find("input[data-appendto='table_sugestao']").each(function(){
			var thisValue		= ($(this).is(".only_numbers"))? $(this).val().toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }):$(this).val();
			lineTable_sugestao	+= '<td>'+thisValue+'</td>';
		});
		lineTable_sugestao		+= '</tr>';
		$(".table_sugestao").find("tbody").append(lineTable_sugestao);
		
		var lineTable_zeiss		= '<tr>';
		$("#add_comparation_modal").find("input[data-appendto='table_zeiss']").each(function(){
			var thisValue		= ($(this).is(".only_numbers"))? $(this).val().toLocaleString('pt-BR', { minimumFractionDigits:2 , currency:'BRL' }):$(this).val();
			lineTable_zeiss	+= '<td>'+thisValue+'</td>';
		});
		lineTable_zeiss		+= '</tr>';
		$(".table_zeiss").find("tbody").append(lineTable_zeiss);
		
		UIkit.modal("#add_comparation_modal").hide();
		$("#add_comparation_modal").find("input").val("");
		$.calc();
		return false;
	}).on("click", ".exit_app", function(){
		$(".app").stop().fadeOut(250, function(){
			$(".zeiss_login").stop().fadeIn(250);
		});
		$("#offcanvas-nav").click();
		window.localStorage.removeItem("user_id");
		return false;
	}).on("keydown", ".only_numbers", function(e){
		var key = e.charCode || e.keyCode || 0;
		return (key == 8 || key == 9 ||key == 13 ||key == 46 ||key == 110 ||key == 190 || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
	});
	
	if(window.localStorage.user_id){
		$(".zeiss_login").css({display:'none'});
		$(".app").css({display:'block'});
		$(".login_form").find("input, button").prop({disabled:false});
		$(".btn_login_form").find("div").addClass("uk-hidden").end().find("span").html(" ENTRAR");
	}
});
//}, false);
