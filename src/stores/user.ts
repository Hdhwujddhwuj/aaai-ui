import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { watch, ref } from "vue";

export const useUserStore = defineStore("user", () => {

    const userId = useLocalStorage("userID", "0");
    const apiKey = useLocalStorage("apikey", "0000000000");

    const ratingCount = ref(0);
    const ratingKudos = ref(0);

    watch(apiKey, async () => {
        updateUserId();
    });

    async function updateUserId() {
        if (apiKey.value == "0000000000" ||  apiKey.value == "" || apiKey.value.length < 8) 
            userId.value = "0";
        else {
            let userSecret = cyrb53(apiKey.value, 8566321);
            const url = `https://api.artificial-art.eu/user/enroll?secret=${userSecret}`;
            const response = await fetch(url);
            const resJSON = await response.json();
            userId.value = resJSON['user_id'];
        }
    }

    watch(userId, async () => {
        updateRatingCount();
    });

    async function updateRatingCount() {
        if (userId.value == "0") 
            return;
        else {
            const url = `https://api.artificial-art.eu/rating/count?uid=${userId.value}`;
            const response = await fetch(url);
            const resJSON = await response.json();
            ratingCount.value = resJSON['rating_count'];
            ratingKudos.value = resJSON['rating_kudos'];
        }
    }

    async function addNewRating(kudos:number) {
        const url = `https://api.artificial-art.eu/rating/add?uid=${userId.value}&kudos=${kudos}`;
        const response = await fetch(url);
        const resJSON = await response.json();
        ratingCount.value = resJSON['rating_count'];
        ratingKudos.value = resJSON['rating_kudos'];
    }
    
    function setAnon() {
        apiKey.value = "0000000000";
        userId.value = "0";
    }
    
    const cyrb53 = (str: string, seed = 0) => {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
          ch = str.charCodeAt(i);
          h1 = Math.imul(h1 ^ ch, 2654435761);
          h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
      };

    return {
        apiKey,
        userId,
        ratingCount,
        ratingKudos,

        setAnon,
        addNewRating,
        updateUserId,
        updateRatingCount,
    }
});