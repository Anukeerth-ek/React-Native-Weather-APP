import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async(key, index)=> {
    try{
        await AsyncStorage.setItem(key, index);

    } catch(error) {
        console.log("error solving value", error)
    }

}

export const getData = async (key)=> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    }
    catch (error) {
        console.log("error retrieving value: ", error)
    }
}