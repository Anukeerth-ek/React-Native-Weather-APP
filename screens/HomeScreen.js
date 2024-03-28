import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { theme } from "../theme/index";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/Weather";
import { weatherImages } from "../constants/index";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStroage";


const bgImage = require("../assets/after_noon.png");
const wind = require("../assets/wind.png");
const drop = require("../assets/drop.png");
const sun = require("../assets/sun.png");

export default function HomeScreen() {
     const [showSearch, isShowSearch] = useState(false);
     const [locations, setLocations] = useState([]);
     const [weather, setWeather] = useState({});
     const [loading, setLoading] = useState(true);

     const handleLocation = (location) => {
          setLocations([]);
          isShowSearch(false);
          setLoading(true)
          fetchWeatherForecast({
               cityName: location.name,
               days: "7",
          }).then((data) => {
               setWeather(data);
               setLoading(false)
               storeData("city", location.name)
          });
     };
     const handleSearch = (value) => {
          // fetch location
          if (value.length > 2) {
               fetchLocations({ cityName: value }).then((data) => {
                    setLocations(data);
               });
          }
     };

     useEffect(() => {
          fetchDefaultWeatherData();
     }, []);

     const fetchDefaultWeatherData = async () => {
          let myCity = await getData('city');
          let cityName = 'Bengaluru'
          if(myCity) cityName = myCity
          fetchWeatherForecast({
               cityName,
               days: "7",
          }).then((data) => {
               setWeather(data);
               setLoading(false)
          });
     };

     const handleTextDebounce = useCallback(debounce(handleSearch, 700), []);
     const { current, location } = weather;

     return (
          <View className=" flex flex-1 relative">
               <StatusBar style="light" />
               <Image blurRadius={30} source={bgImage} className="absolute w-full min-h-screen " />
               {/* SEARCH SECTION */}

               {loading? (
                    <View className="flex-1 flex-row justify-center items-center">
                         <Progress.CircleSnail thickness={10} size={150} color="#fff"/>
                    </View>
               ) : (
                    <SafeAreaView className="flex flex-1">
                         <View style={{ height: "7%" }} className="mx-3">
                              <View
                                   className="flex-row justify-end items-center rounded-full p-7 mt-9"
                                   style={{ backgroundColor: showSearch ? theme.bgWhite(0.3) : "transparent" }}
                              >
                                   {showSearch ? (
                                        <TextInput
                                             onChangeText={handleTextDebounce}
                                             placeholder="Search City "
                                             placeholderTextColor={"white"}
                                             className="pl-2 h-10 text-base text-white flex-1"
                                        />
                                   ) : null}

                                   <TouchableOpacity
                                        style={{ backgroundColor: theme.bgWhite(0.3) }}
                                        className="rounded-full w-11 m-1 p-2 left-7"
                                        onPress={() => isShowSearch(!showSearch)}
                                   >
                                        <MagnifyingGlassIcon size="30" color="white" />
                                   </TouchableOpacity>
                              </View>
                              {locations.length > 0 && showSearch ? (
                                   <View className="absolute w-full bg-white top-24 rounded-3xl ">
                                        {locations.map((location, index) => {
                                             let showBorder = index + 1 != locations.length;
                                             let borderClass = showBorder ? "border-b-2 border-b-gray-400" : "";
                                             return (
                                                  <TouchableOpacity
                                                       key={index}
                                                       className={
                                                            "flex-row items-center border-0 p-3 px-4 z-50 " +
                                                            borderClass
                                                       }
                                                       onPress={() => handleLocation(location)}
                                                  >
                                                       <MapPinIcon size={"20"} color={"gray"} />
                                                       <Text className="text-black text-lg ml-2 ">
                                                            {location.name} {location.country}
                                                       </Text>
                                                  </TouchableOpacity>
                                             );
                                        })}
                                   </View>
                              ) : null}
                         </View>
                         {/* FORECAST SECTION */}
                         {/* {showSearch ? (
                         console.log("true conditon")
                    ) : ( */}
                         <View>
                              <View className="absolute top-32 left-20">
                                   <View style={{ display: "flex", justifyContent: "center" }}>
                                        <Text className="text-white  text-3xl font-bold">
                                             {location?.name}
                                             <Text className="text-xl font-semibold"> {location?.country}</Text>
                                        </Text>
                                   </View>

                                   {/* WEATHER IMAGES */}
                                   <View className="flex-row justify-center mt-6">
                                        <Image
                                             source={weatherImages[current?.condition?.text]}
                                             style={{ width: 256, height: 208 }}
                                        />
                                   </View>
                                   {/* DISPLAYING DEGREE & WEATHER CONDITION*/}
                                   <View className="space-y-2">
                                        <Text className="text-center font-bold text-white text-6xl ml-2 mt-6">
                                             {current?.temp_c}&#176;
                                        </Text>
                                        <Text className="text-center text-white text-xl tracking-widest">
                                             {current?.condition?.text}
                                        </Text>
                                   </View>
                                   {/* OTHER STATS */}
                                   <View className="flex-row justify-between my-10 -mx-4">
                                        <View className="flex-row  space-x-1 items-center -left-9 ">
                                             <Image source={wind} className="h-6 w-6 " />
                                             <Text className="text-white font-semibold text-xl">
                                                  {" "}
                                                  {current?.wind_kph}km
                                             </Text>
                                        </View>
                                        <View className="flex-row space-x-1 items-center mr-3 ">
                                             <Image source={drop} className="h-6 w-6 " />
                                             <Text className="text-white font-semibold text-xl">
                                                  {" "}
                                                  {current?.humidity}%
                                             </Text>
                                        </View>
                                        <View className="flex-row space-x-1 items-center left-6">
                                             <Image source={sun} className="h-6 w-6 " />
                                             <Text className="text-white font-semibold text-xl">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                        </View>
                                   </View>
                              </View>

                              {/* FORECAST FOR NEXT DAYS */}
                              <View className="mb-2 space-y-3 absolute top-96 ">
                                   <View className="flex-row items-center mx-5 space-x-2 top-64">
                                        <CalendarDaysIcon size={"25"} color={"white"} />
                                        <Text className="text-white text-base">Daily Forecast</Text>
                                   </View>
                                   <ScrollView
                                        horizontal
                                        contentContainerStyle={{ paddingHorizontal: 15 }}
                                        showsHorizontalScrollIndicator={false}
                                        className="top-64"
                                   >
                                        {weather?.forecast?.forecastday?.map((item, index) => {
                                             let date = new Date(item.date);
                                             let options = { weekday: "long" };
                                             let dayName = date.toLocaleDateString("en-US", options);
                                             return (
                                                  <View
                                                       key={index}
                                                       style={{
                                                            flex: 1,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            width: 80,
                                                            borderRadius: 20,
                                                            paddingVertical: 10,
                                                            marginHorizontal: 7,
                                                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                                                       }}
                                                  >
                                                       <Image
                                                            source={weatherImages[item?.day?.condition?.text]}
                                                            style={{ width: 30, height: 30 }}
                                                       />
                                                       <Text style={{ color: "white", textAlign: "center" }}>
                                                            {dayName}
                                                       </Text>
                                                       <Text style={{ color: "white", textAlign: "center" }}>
                                                            {item?.day?.avgtemp_c}&#176;
                                                       </Text>
                                                  </View>
                                             );
                                        })}
                                   </ScrollView>
                              </View>
                         </View>
                         {/* )} */}
                    </SafeAreaView>
               )}
          </View>
     );
}
