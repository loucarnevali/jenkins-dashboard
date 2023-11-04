require('dotenv').config();

import axios from 'axios';
import moment from 'moment';

import express from 'express';
import { Request, Response } from 'express';
const app = express();
const port = 8180;

import "reflect-metadata"
import { getManager } from 'typeorm';
import { JobDetailsRepository } from './job-details.entity';

const { 
  JENKINS_USERNAME,
  JENKINS_API_KEY,
  JENKINS_API_BASE_URL 
} = process.env;

const jobs: any[] = [];

// FUNCTION TO SEARCH FOR DEATILS OF SPECIFIC JOB
async function JobDetails(name:string, color:string, url:string) {
  const response = await axios.get(
    `http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` +
    `${url.match(/\/job.*\//)}` + 
    `/api/json`);
  const { displayName, timestamp } = response.data;

  const date = new Date(timestamp);
  jobs.push({
    name,
    color,
    date: moment(date).format('yyyy-MM-DD HH:mm:ss'),
    build: displayName,
  });
}

// FUNCTION TO SEARCH FOR A JOB DESCRIPTION
async function JobDescription(url: string) {
  const response = await axios.get(
    `http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` +
    `${url.match(/\/job.*\//)}` + 
    `/api/json`);
  const { name, color, builds } = response.data;

  for (const build of builds) {
    if (build._class === 'org.jenkinsci.plugins.workflow.job.WorkflowRun') {
      await JobDetails(name, color, build.url);
    }
  }
}

// FUNCTION TO SEARCH FOR JOBS WITHIN A DIRECTORY
async function JobFolder(url: string) {
  const response = await axios.get(
    `http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` +
    `${url.match(/\/job.*\//)}` + 
    `/api/json`);

  const { jobs: folderJobs } = response.data;
  for (const folderJob of folderJobs) {
    switch (folderJob._class) {
      case 'com.cloudbees.hudson.plugins.folder.Folder':
        await JobFolder(folderJob.url);
        break;
      case 'org.jenkinsci.plugins.workflow.job.WorkflowJob':
        await JobDescription(folderJob.url);
        break;
      case 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject':
        await JobFolder(folderJob.url);
        break;
    }
  }
}

app.get('/api/v1/jobs', async (req: Request, res: Response) => {
  try {
    console.info(req.originalUrl);
    const response = await axios.get(
      `http://${JENKINS_USERNAME}:${JENKINS_API_KEY}@${JENKINS_API_BASE_URL}` +
      `/api/json`);
    const { jobs: rootJobs } = response.data;

    for (const rootJob of rootJobs) {
      switch (rootJob._class) {
        case 'com.cloudbees.hudson.plugins.folder.Folder':
          await JobFolder(rootJob.url);
          break;
        case 'org.jenkinsci.plugins.workflow.job.WorkflowJob':
          await JobDescription(rootJob.url);
          break;
        case 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject':
          await JobFolder(rootJob.url);
          break;
      }
    }
    res.send(JSON.stringify(jobs));
    jobs.length = 0;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Jenkins API listening on port ${port}`);
});