require('dotenv').config();
const Keycloak = require('keycloak-connect');
const express = require('express')
const session = require('express-session');
const axios = require('axios')
const moment = require('moment')
const fs = require('fs');
const app = express()
const port = 8180

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

var JENKINS_USERNAME = process.env.JENKINS_USERNAME
var JENKINS_API_KEY = process.env.JENKINS_API_KEY
var JENKINS_API_BASE_URL = process.env.JENKINS_API_BASE_URL

var jobs = []
var name = '', color = ''

async function jobDetails(name, color, url) {
  await axios.get(`http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` + url.match("\/job.*\/") + '/api/json' ,)
  .then(response => {
    Object.entries(response.data).forEach(([key, value]) => {
      switch(key) {
         case "displayName":
          displayName = value
          break
         case "timestamp":
          var date = new Date(value)
          jobs.push("{ \"name\":\"" + name + "\",\"color\":\"" + color + "\",\"date\":\"" + moment(date).format('yyyy-MM-DD HH:mm:ss') + "\",\"build\":\"" + displayName + "\"}")
          break
      }
    })
  })
}

async function jobDescription(url) {
   await axios.get(`http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` + url.match("\/job.*\/") + '/api/json' ,)
  .then(response => {
    Object.entries(response.data).forEach(([key, value]) => {
      switch(key) {
        case "name":
          name = value
          break
        case "color":
          color = value
          break
        case "builds":
          Object.entries(value).forEach(([index]) => {
            switch(value[index]._class) {
              case "org.jenkinsci.plugins.workflow.job.WorkflowRun":
                jobDetails(name, color,value[index].url)
                break
            }
          })
      }
    })
  })
}

function jobFolder(url) {
   axios.get(`http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` + url.match("\/job.*\/") + '/api/json' ,)
  .then(response => {
    Object.entries(response.data).forEach(([key, value]) => {
      switch(key) {
        case "jobs": 
          Object.entries(value).forEach(([index]) => {
            switch(value[index]._class) {
              case "com.cloudbees.hudson.plugins.folder.Folder":
                jobFolder(value[index].url, jobs)
                break
              case "org.jenkinsci.plugins.workflow.job.WorkflowJob":
                jobDescription(value[index].url, jobs)
                break
              case "org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject":
                jobFolder(value[index].url, jobs)
                break
            }
          })
        }
      })
  })
  .catch(error => {
    console.log(error);
  });
}

app.get('/api/v1/jobs', async (req, res) => {
  axios.post(`http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` + '/api/json',)
    .then(response => {
      Object.entries(response.data).forEach(([key, value]) => {
        switch(key) {
          case "jobs":
            Object.entries(value).forEach(([index]) => {
              switch(value[index]._class) {
                case "com.cloudbees.hudson.plugins.folder.Folder":
                  jobFolder(value[index].url)
                  break
                case "org.jenkinsci.plugins.workflow.job.WorkflowJob":
                  jobDescription(value[index].url)
                  break
                case "org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject":
                  jobFolder(value[index].url, jobs)
                break                  
              }
            })
            break
        }
      });
    })
    .finally(function () {
      console.info(req.originalUrl)
      res.send( "[" + jobs + "]")
      // reset array
      jobs.length = 0
      // -
    })
    .catch(error => {
      console.log(error);
  });
})

app.listen(port, () => {
  console.log(`Jenkins UI listening on port ${port}`)
})
