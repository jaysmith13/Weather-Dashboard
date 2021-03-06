class dailyweather{
    date = new this.date();
    icon = {
        name:'',
    }
temp=0;
humidity=0;
constructor(temp, humidity){
    this.temp = temp;
    this.humidity = humidity;

}
setDate(openWeatherDate){
    this.date = new Date(openWeatherDate*1000);
    return this;
}
setIconName(iconName){
    this.icon.name = iconName.slice(0, iconName.length - 1)+ this.generateIconEnding();
    return this;
}
setIconDescription(IconDescription){
    this.Icon.description = IconDescription;
    return this;
    }
}
dailyweather.prototype.generateIconEnding = function(){
    const hour = this.date.getHours();
    return (hour >= 0 && hour <12)? 'n':'d';
};