<template>
<div id="app" style="position: absolute;">
<div>
  <article v-bind:class="`${ item.color }`" v-for="item in rowCard.value" v-bind:key="item">
      <div class="weatherIcon"><i class="wi wi-day-cloudy"></i></div>
      <div class="weatherInfo">
        <div class="temperature"><span>fsbano</span></div>
        <div class="description">    
          <div class="weatherCondition">{{  item.build }}</div>    
          <div class="place">{{ item.name }}</div>
      </div>
      </div>
      <div class="date">{{ item.date }}</div>
  </article>
</div>
<div><Chart style="height: 300px; width: 300px;" type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" /></div>
</div>
<br/>
<ag-grid-vue
    class="ag-theme-alpine-dark"
    style="height: 800px; width: 750px; margin-left: 45%;"
    :columnDefs="columnDefs.value"
    :rowData="rowData.value"
    :defaultColDef="defaultColDef"
  >
</ag-grid-vue>

</template>
<script>
import { AgGridVue } from "ag-grid-vue3";
import { reactive, onMounted, ref } from "vue";
import Chart from 'primevue/chart';

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

export default {
  name: "App",
  components: {
    AgGridVue,
    Chart
  },
  setup() {
    const rowData = reactive({})
    const rowCard = reactive({})
    const rowSuccessful = reactive({})
    const rowFailure  = reactive({})
    const rowNotBuilt = reactive({})
    const rowNotBuiltAnime = reactive({})

    const chartData = ref({
    labels: ['Successful', 'Failure'],
    datasets: [
        {
            label: 'Jobs',
            data: [rowSuccessful, rowFailure, rowNotBuilt, rowNotBuiltAnime],
            backgroundColor: ['#069E6E', 'rgb(201, 100, 100)'],
            borderColor: ['#069E6E', 'rgb(201, 100, 100)' ],
            borderWidth: 1
        }
    ]
    });
    const chartOptions = ref({
      cutout: '90%',
      scales: {
        y: {
            beginAtZero: true,
        }
      }
    });


    const columnDefs = reactive({
      value: [
           { field: "name" },
           { field: "color" },
           { field: "date" },
           { field: "build" }
      ],
    });

    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1
    };

    onMounted(() => {
      fetch("/api/v1/jobs")
        .then((result) => result.json())
        .then((remoteRowData) => { 
          remoteRowData.sort( ( a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          rowData.value = remoteRowData.slice(0,29)
          rowCard.value = remoteRowData.slice(0,2)
          var i = 0
          var j = 0
          var y = 0
          var z = 0
          remoteRowData.filter( item => {
            switch (item.color) {
              case "blue":
                ++i
                break
              case "red":
                ++j
                break
              case "notbuilt":
                ++y
                break
              case "notbuilt_anime":
                ++z
                break

            }
          })
          rowSuccessful.value = i
          rowFailure.value = j
          rowNotBuilt.value = y
          rowNotBuiltAnime.value = z
        })
    });
    return {
      columnDefs,
      rowData,
      rowCard,
      rowSuccessful,
      rowFailure,
      rowNotBuilt,
      rowNotBuiltAnime,
      defaultColDef,
      Chart,
      chartData,
      chartOptions
    };
  },
  data() {
    return {
      AgGridVue,
    };
  },
};
</script>
<style>
#app {
  text-align: center;
  margin-left: 1%;
  margin-top: 25px;
}

@import url(https://fonts.googleapis.com/css?family=Poiret+One);
@import url(https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css);

body {
  background-color: #2d2e3a;
  font-family: Poiret One;
}

.notbuilt, .notbuilt_anime, .blue_anime, .aborted {
  position: relative;
  margin-bottom: 10%;
  display: flex;
  height: 300px;
  width: 600px;
  flex-wrap: wrap;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15);
  
  .weatherIcon{
    flex: 1 100%;
    height: 60%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: rgb(50, 50, 50);
    font-family: weathericons;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 100px;
    
    i{
      padding-top: 30px;
    }
  }
  
  .weatherInfo{
    flex: 0 0 70%;
    height: 40%;
    background: rgb(50, 50, 50);
    border-bottom-left-radius: 20px;
    display: flex;
    align-items: center;
    color: rgb(219, 218, 218);
    
    .temperature{
      flex: 0 0 40%;
      width: 100%;
      font-size: 42px;
      display: flex;
      justify-content: space-around;
    }
    
    .description{
      flex: 0 60%;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      justify-content: center;
      
      .weatherCondition{
        text-transform: uppercase;
        font-size: 35px;
        font-weight: 100;
      }
      
      .place{
        font-size: 35px;
      }
    }
  }
  
  .date{
    flex: 0 0 30%;
    height: 40%;
    background: rgb(50, 50, 50);
    border-bottom-right-radius: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color:  rgb(219, 218, 218);
    font-size: 18px;
    font-weight: 800;
  }
}

.red {
  position: relative;
  margin-bottom: 10%;
  display: flex;
  height: 300px;
  width: 600px;
  flex-wrap: wrap;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15);
  
  .weatherIcon{
    flex: 1 100%;
    height: 60%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: rgb(201, 100, 100);
    font-family: weathericons;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 100px;
    
    i{
      padding-top: 30px;
    }
  }
  
  .weatherInfo{
    flex: 0 0 70%;
    height: 40%;
    background: rgb(201, 100, 100);
    border-bottom-left-radius: 20px;
    display: flex;
    align-items: center;
    color: white;
    
    .temperature{
      flex: 0 0 40%;
      width: 100%;
      font-size: 42px;
      display: flex;
      justify-content: space-around;
    }
    
    .description{
      flex: 0 60%;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      justify-content: center;
      
      .weatherCondition{
        text-transform: uppercase;
        font-size: 25px;
        font-weight: 100;
      }
      
      .place{
        font-size: 25px;
      }
    }
  }
  
  .date{
    flex: 0 0 30%;
    height: 40%;
    background: rgb(201, 100, 100);
    border-bottom-right-radius: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    font-size: 18px;
    font-weight: 800;
  }
}

.blue {
  position: relative;
  margin-bottom: 10%;
  display: flex;
  height: 300px;
  width: 600px;
  flex-wrap: wrap;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15);
  
  .weatherIcon{
    flex: 1 100%;
    height: 60%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: #069E6E;
    font-family: weathericons;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 100px;
    
    i{
      padding-top: 30px;
    }
  }
  
  .weatherInfo{
    flex: 0 0 70%;
    height: 40%;
    background: #069E6E;
    border-bottom-left-radius: 20px;
    display: flex;
    align-items: center;
    color: white;
    
    .temperature{
      flex: 0 0 40%;
      width: 100%;
      font-size: 42px;
      display: flex;
      justify-content: space-around;
    }
    
    .description{
      flex: 0 60%;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      justify-content: center;
      
      .weatherCondition{
        text-transform: uppercase;
        font-size: 35px;
        font-weight: 100;
      }
      
      .place{
        font-size: 25px;
      }
    }
  }
  
  .date{
    flex: 0 0 30%;
    height: 40%;
    background: #069E6E;
    border-bottom-right-radius: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    font-size: 18px;
    font-weight: 800;
  }
}


p{
  position: fixed;
  right: 2%;
  a{
    text-decoration: none;
    color: #E4D6A7;
    font-size: 10px;
  }
}

.ag-header-cell-label {
  justify-content: center;
}

.ag-theme-alpine-dark {
   font-size :  14px;
   font-family: "Poiret One" !important;
}

</style>