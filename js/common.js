"use strict";
var size = 100;
var timeStart, timeFinish, curTime;
var timerOn = false;

// Инициализация поля
function Initpole(){
	var cellStr = '<a class="cell" href="javascript:void(0);">num</a>';
	
	for (var i = 0; i < 16; i++) {
		// Рассчет координат
		var x = Math.round(i % 4);
		var y = Math.floor(i / 4);

		// Создание элементов
		var s = (i < 15) ? cellStr.replace('num', i + 1) : cellStr.replace('num', '');
		$('.pole').append(s);
		
		// Присвоение атрибутов
		var c = $('.pole .cell').eq(i);
		c.attr('num', y * 4 + x);
		c.css({
			top: y * size,
			left: x * size
		});
		$('.pole .cell').eq(15).attr('id', 'empty-cell');
	}
	Nulls();
}

// Функция "Поменять 2 ячейки местами"
function ChangeCells(cell1, cell2){
	var num1 = cell1.attr('num');
	var num2 = cell2.attr('num');

	var x1 = Math.round(num1 % 4);
	var y1 = Math.floor(num1 / 4);
	var x2 = Math.round(num2 % 4);
	var y2 = Math.floor(num2 / 4);
	var dx = Math.abs(x1 - x2);
	var dy = Math.abs(y1 - y2);

	if((dx < 2) && (dy < 2) && !((dx == 1) && (dy == 1))){
		cell1.attr('num', num2);
		cell2.attr('num', num1);
		cell1.stop().animate({
	    top: y2 * size,
	    left: x2 * size
	 	}, 100 );
	 	cell2.stop().css({
	    top: y1 * size,
	    left: x1 * size
	 	});
		$('.ui .steps .steps-num').html(parseInt($('.ui .steps .steps-num').html()) + 1);
	}
	if(!timerOn){
		TimeStart();
	}
	CheckWin();
}



 var clocktimer;

function Clear() {
	timerOn = false;
	clearTimeout(clocktimer);
	$('.ui .time .time-num').html('00:00,00');
}


function GetTimerString(start, cur) { 
	var t = cur - start;
	var ms = t%1000; t-=ms; ms=Math.floor(ms/10);
	t = Math.floor (t/1000);
	var s = t%60; t-=s;
	t = Math.floor (t/60);
	var m = t%60; t-=m;
	t = Math.floor (t/60);
	if (m<10) m='0'+m;
	if (s<10) s='0'+s;
	if (ms<10) ms='0'+ms;
	return m + ':' + s + ',' + ms;
}

function Timer() { 
	var timeCur = new Date();
	if (timerOn) $('.ui .time .time-num').html(GetTimerString(timeStart, timeCur));
	clocktimer = setTimeout("Timer()",10);
}

function findTIME() {
	if(!timerOn) {
		TimeStart();
	} 
	else {
		TimeFinish();
		Clear();
	}
}




function TimeStart(){
	timeStart = new Date();
	Timer();
	timerOn = true;
}

function TimeFinish(){
	var timeFinish = new Date();
	$('.ui .time .time-num').html(GetTimerString(timeStart,timeFinish));
	timerOn = false;
}




function CheckWin(){
	var win = true;
	$('.pole a.cell').each(function(c){
		var num = $(this).attr('num');
		var eq = $('.pole a.cell').index($(this));
		if(eq != num){
			win = false;
		}
	});
	if(win){
		$('.ui .win').html('ПОБЕДА!');
		TimeFinish();
	}
}


// Инициализация 
function Init(){
	$('.pole a.cell').on('mousedown', function(){
		var emptyCell = $('.pole #empty-cell');
		ChangeCells($(this), emptyCell);
	});
	$('.crush-btn').on('click', function(){
		Crush();
	});
	$('.ui .time').on('click', function(){

	});
}

// Функция запутывания
function Crush(){
	for (var i = 0; i < 100; i++) {
		var cells = GetFourCellsToRotate();

		ChangeFourCells(cells[0], cells[1], cells[2], cells[3]);
	}
	CrushAnimate();
	Nulls();
	Clear();
}

// Обнуление значений
function Nulls(){
	$('.ui .steps .steps-num').html(0);
	$('.ui .time .time-num').html('00:00,00');
	$('.ui .win').html('');
}


// Вспомогательная функция для корректного запутывания
// Генерирует точку вращения и проверяет наличие ячеек вокруг нее
// Возвращает массив из 4-х ячеек для вращения
function GetFourCellsToRotate(){
	var emptyCell = $('.pole #empty-cell');
	var eNum = parseInt(emptyCell.attr('num'));
	var ex = Math.round(eNum % 4);
	var ey = Math.floor(eNum / 4);

	do{
		var side = getRandomInt(0, 3);
	} while (!CheckCellsToRotate(side));

	var cells = [];
	if(side == 0){
		cells[0] = $('.pole a.cell').filter($('[num="' + (eNum - 5) + '"]'));
		cells[1] = $('.pole a.cell').filter($('[num="' + (eNum - 4) + '"]'));
		cells[2] = $('.pole a.cell').filter($('[num="' + (eNum) + '"]'));
		cells[3] = $('.pole a.cell').filter($('[num="' + (eNum - 1) + '"]'));
	}
	if(side == 1){
		cells[0] = $('.pole a.cell').filter($('[num="' + (eNum - 4) + '"]'));
		cells[1] = $('.pole a.cell').filter($('[num="' + (eNum - 3) + '"]'));
		cells[2] = $('.pole a.cell').filter($('[num="' + (eNum + 1) + '"]'));
		cells[3] = $('.pole a.cell').filter($('[num="' + (eNum) + '"]'));
	}
	if(side == 2){
		cells[0] = $('.pole a.cell').filter($('[num="' + (eNum) + '"]'));
		cells[1] = $('.pole a.cell').filter($('[num="' + (eNum + 1) + '"]'));
		cells[2] = $('.pole a.cell').filter($('[num="' + (eNum + 5) + '"]'));
		cells[3] = $('.pole a.cell').filter($('[num="' + (eNum + 4) + '"]'));
	}
	if(side == 3){
		cells[0] = $('.pole a.cell').filter($('[num="' + (eNum - 1) + '"]'));
		cells[1] = $('.pole a.cell').filter($('[num="' + (eNum) + '"]'));
		cells[2] = $('.pole a.cell').filter($('[num="' + (eNum + 4) + '"]'));
		cells[3] = $('.pole a.cell').filter($('[num="' + (eNum + 3) + '"]'));
	}
	return cells;
}

// Вспомогательная функция для корректного запутывания
// Проверяет наличие ячеек вокруг точки вращения
// Возвращает true - если все ок, иначе - false
function CheckCellsToRotate(side){
	var emptyCell = $('.pole #empty-cell');
	var eNum = parseInt(emptyCell.attr('num'));
	var ex = Math.round(eNum % 4);
	var ey = Math.floor(eNum / 4);

	switch (side) {
		case 0:
			if(ex > 0 && ey > 0) return true;
			break;
		case 1:
			if(ex < 3 && ey > 0) return true;
			break;
		case 2:
			if(ex < 3 && ey < 3) return true;
			break;
		case 3:
			if(ex > 0 && ey < 3) return true;
			break;
		default:
			return false;
	}
}


// Вспомогательная функция для корректного запутывания
// Проворот при запутывании
function ChangeFourCells(cell1, cell2, cell3, cell4){
	var num1 = cell1.attr('num');
	var num2 = cell2.attr('num');
	var num3 = cell3.attr('num');
	var num4 = cell4.attr('num');

	cell1.attr('num', num2);
	cell2.attr('num', num3);
	cell3.attr('num', num4);
	cell4.attr('num', num1);
}

// Анимация запутывания 
function CrushAnimate(){
	$('.pole a.cell').each(function(c){
		var num = $(this).attr('num');
		var x = Math.round(num % 4);
		var y = Math.floor(num / 4);
		$(this).animate({
			top: y * size,
			left: x * size
		}, 100 );
	});
}


// Возвращает случайное целое от min до max включительно
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




$(document).ready(function () {
	Initpole();
	Init();
});

