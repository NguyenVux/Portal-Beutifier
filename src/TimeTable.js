const cellList= [];
const schedule = createSchedule();
const container = $('.mycontent>.container')[0]
container.appendChild(schedule);
const observer = new MutationObserver(mutationHandler);
let data = null;
function mutationHandler(mutationList,observer){
	cellList.forEach(element=>{
		if(!element.dataset.header)
		{
			element.innerHTML = '';
		}
	})
	main();
}
async function main() {
	const data_bindsValue = ['text: TenMH',"html: LichHocLT",'html: LichHocTH'];
	const T_Rows = [...data.children].map(tr=>{
		tr = [...tr.children].filter(td => data_bindsValue.includes(td.dataset['bind']))
		return {name:tr[0].innerText,lt:tr[1].innerText,th:tr[2].innerText}

	});
	T_Rows.forEach(element => {
		const timeTH = element.th.split('\n');
		timeTH.forEach(e =>{ 
			const props = parseTime(e);
			if(props)
			{
				const card =  TimeCard({
					size:props.size,
					offset:props.offset,
					courseName:`${element.name} ${props.room?' - ' + props.room:''}<br>TH`,
					courseTime:props.timeString});
				schedule.children[props.DayOfWeek].children[props.start-7+1].appendChild(card);
			}
		});
		const timeLT = element.lt.split('\n');
		timeLT.forEach(e =>{ 
			const props = parseTime(e);
			if(props)
			{
				const card =  TimeCard({
					size:props.size,
					offset:props.offset,
					courseName:`${element.name} ${props.room?' - ' + props.room:''}<br>LT`,
					courseTime:props.timeString});
				schedule.children[props.DayOfWeek].children[props.start-7+1].appendChild(card);
			}
		})
	});
};


let checkExist = setInterval(function() {
	if ($('[data-bind="foreach: dsKetQuaDKHP"]').length) {
	data = $('[data-bind="foreach: dsKetQuaDKHP"]')[0];
	observer.observe(data,{subtree:true,childList:true})
	main();
	clearInterval(checkExist);
	}
}, 100);

const DayOfWeekObj={
	T2:1,
	T3:2,
	T4:3,
	T5:4,
	T6:5,
	T7:6,
	CN:7,
};
function parseTime(time){
	if(!time)
		return undefined;
	const [DayOfWeek,_time,...room] = time.split(' ');
	const [_start,_end] = _time.split('-').map((value)=>value.split(':'));
	const start = parseInt(_start[0]);
	const offset = parseInt(_start[1])/60;
	const end = parseInt(_end[0]);
	const end_offset = parseInt(_end[1])/60;
	return {
		size:(end+end_offset)-(start+offset),
		offset:offset,
		DayOfWeek:DayOfWeekObj[DayOfWeek],
		start:start,room:room.join(' '),
		timeString:_time
	}
}

function createDayOfWeek(){
	const frag = document.createDocumentFragment();
	for(let i = 0; i < 7;i++)
	{
		const e = createDateCol(i);
		frag.appendChild(e);
	}
	return frag;
}
function createDateCol(Dof)
{
	const col = document.createElement('ul');
	const element = document.createDocumentFragment();
	const DayOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
	for(let i = 0; i <= 12; i++)
	{
		const e = document.createElement('li');
		cellList.push(e);
		if(i === 0)
		{
			e.innerHTML = `${DayOfWeek[Dof]}`;
			e.dataset.header = true;
		}
		element.appendChild(e);
	}
	col.classList.add(...'schedule__col schedule__col--dayOfWeek'.split(' '))
	col.appendChild(element)
	return col;
}

function createSchedule(){
	const div = document.createElement('div');
	div.classList.add(["schedule"])
	div.appendChild(createTimeline())
	div.appendChild(createDayOfWeek())
	return div;
}

function TimeCard({courseName="",courseTime='',size, offset,...props})
{
	const wrapper = document.createElement('div');
	wrapper.classList.add('time-card');
	const time = document.createElement('div');
	const name = document.createElement('div');
	time.classList.add('course-time');
	time.innerHTML = courseTime;
	name.classList.add('course-name');
	name.innerHTML = courseName;
	wrapper.appendChild(time);
	wrapper.appendChild(name);
	wrapper.style.height = `${size*100}%`;
	wrapper.style.top = `${offset*100}%`;
	const pallet = [
		"#1C0C5B",
		"#3D2C8D",
		"#916BBF",
		"#C996CC",
		"#345B63",
		"#152D35",
		"#112031",
	]
	wrapper.style.backgroundColor = getRandomFromArray(pallet);
	return wrapper;
}

function getRandomFromArray(array)
{
	return array[Math.floor(Math.random()*array.length)];
}

function createTimeline(){
	const col = document.createElement('ul');
	const element = document.createDocumentFragment();
	col.appendChild(document.createElement('li'))
	for(let i = 7; i <=18; i++)
	{
		const e = document.createElement('li');
		e.innerHTML = `${i<10?`0`:''}${i}:00`;
		element.appendChild(e);
	}
	col.classList.add(...'schedule__col schedule__col--timeline'.split(' '))
	col.appendChild(element);
	return (col);
}