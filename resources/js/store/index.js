// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        gmap: null,
        gmapInfoWindow: null,
        layers:null,
        fireChartEvent: null,
        chartColors:[],
        mapLocation:{ lat: 7.9708759, lng: 80.2615532 },
        queryArea:null,
        queryBoundary:null,
        layerPoints:[],
        newLayer:null,
        validationErrors: {},
        stepperStep:0,
        retirementStat:null,
        educationStat:null,
        cadreStat:null,
        pFileStat:null
    },
    mutations: {
        setGMap(state, payload) {
            state.gmap = payload;
        },
        setInfoWindow(state, payload) {
            state.gmapInfoWindow = payload;
        },
        setLayers(state, payload) {
            state.layers = payload;
        },
        setFireChartEvent(state,payload){
            state.fireChartEvent = payload;
        },
        setChartColors(state,payload){
            state.chartColors = payload;
        },
        setMapLocation(state,payload){
            state.mapLocation = payload
        },
        queryArea(state,payload){
            state.queryArea = payload
        },
        setQueryBoundary(state,payload){
            state.queryBoundary = payload
        },
        setValidationError(state, { field, message }) {
            if (message) {
                // If there is a message, set/update the error for the field
                state.validationErrors[field] = message;
            } else {
                // If no message is provided, clear the error for the field
                delete state.validationErrors[field];
            }
        },

        // New mutation to clear all validation errors
        clearValidationErrors(state) {
            state.validationErrors = {};
        },
        setStep(state,number){
            state.stepperStep  = number;
        },

        setRetirementStat(state,payload){
            state.retirementStat  = payload;
        },
        setEducationStat(state,payload){
            state.educationStat  = payload;
        },

        setCadreStat(state,payload){
            state.cadreStat  = payload;
        },

        setPFileStat(state,payload){
            state.pFileStat  = payload;
        },



    },
    actions: {
        // Actions for performing asynchronous operations go here
    },
    getters: {
        gmap: state => state.gmap,
        gmapInfoWindow: state => state.gmapInfoWindow,
        layers: state => state.layers,
        fireChartEvent: state => state.fireChartEvent,
        chartColors: state => state.chartColors,
        mapLocation: state => state.mapLocation,
        queryArea: state => state.queryArea,
        queryBoundary: state => state.queryBoundary,
        layerPoints: state => state.layerPoints,
        newLayer: state => state.newLayer,
        validationErrors: state => state.validationErrors,
        stepperStep: state => state.stepperStep,
        hasValidationErrors: state => Object.keys(state.validationErrors).length > 0,
        retirementStat: state => state.retirementStat,
        educationStat: state => state.educationStat,
        cadreStat: state => state.cadreStat,
        pFileStat: state => state.pFileStat,
    },
});

export default store;
