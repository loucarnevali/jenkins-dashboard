package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

const (
	JENKINS_USERNAME     = "fsbano"
	JENKINS_API_KEY      = "11469531bf1421975eb2ebd2e44c5ad700"
	JENKINS_API_BASE_URL = "http://eugenia:8080"
)

var jobs []Job

type Job struct {
	Name  string `json:"name"`
	Color string `json:"color"`
	Date  string `json:"date"`
	Build string `json:"build"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/api/v1/jobs", GetJobs).Methods("GET")

	port := "8081"
	fmt.Printf("Jenkins UI listening on port %s\n", port)
	http.Handle("/", router)
	http.ListenAndServe(":"+port, nil)
}

func GetJobs(w http.ResponseWriter, r *http.Request) {
	// Reset jobs array
	jobs = nil

	client := &http.Client{}

	url := fmt.Sprintf("%s/api/json", JENKINS_API_BASE_URL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Basic "+basicAuth(JENKINS_USERNAME, JENKINS_API_KEY))

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("HTTP error! Status: %d\n", resp.StatusCode)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		fmt.Println("Error decoding response:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	jobsData, ok := data["jobs"].([]interface{})
	if !ok {
		fmt.Println("Error: jobs key not found in response")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	for _, job := range jobsData {
		jobData, ok := job.(map[string]interface{})
		if !ok {
			fmt.Println("Error: job data format not recognized")
			continue
		}

		switch jobData["_class"] {
		case "com.cloudbees.hudson.plugins.folder.Folder":
			jobFolder(jobData["url"].(string))
		case "org.jenkinsci.plugins.workflow.job.WorkflowJob":
			jobDescription(jobData["url"].(string))
		case "org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject":
			jobFolder(jobData["url"].(string))
		}
	}

	json.NewEncoder(w).Encode(jobs)
}

func jobFolder(url string) {
	client := &http.Client{}

	req, err := http.NewRequest("GET", url+"/api/json", nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Set("Authorization", "Basic "+basicAuth(JENKINS_USERNAME, JENKINS_API_KEY))

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("HTTP error! Status: %d\n", resp.StatusCode)
		return
	}

	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		fmt.Println("Error decoding response:", err)
		return
	}

	jobsData, ok := data["jobs"].([]interface{})
	if !ok {
		fmt.Println("Error: jobs key not found in response")
		return
	}

	for _, job := range jobsData {
		jobData, ok := job.(map[string]interface{})
		if !ok {
			fmt.Println("Error: job data format not recognized")
			continue
		}

		switch jobData["_class"] {
		case "com.cloudbees.hudson.plugins.folder.Folder":
			jobFolder(jobData["url"].(string))
		case "org.jenkinsci.plugins.workflow.job.WorkflowJob":
			jobDescription(jobData["url"].(string))
		case "org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject":
			jobFolder(jobData["url"].(string))
		}
	}
}

func jobDescription(url string) {
	client := &http.Client{}

	req, err := http.NewRequest("GET", url+"/api/json", nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Set("Authorization", "Basic "+basicAuth(JENKINS_USERNAME, JENKINS_API_KEY))

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("HTTP error! Status: %d\n", resp.StatusCode)
		return
	}

	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		fmt.Println("Error decoding response:", err)
		return
	}

	var name, color, displayName string
	var timestamp int64

	for key, value := range data {
		switch key {
		case "name":
			name = value.(string)
		case "color":
			color = value.(string)
		case "timestamp":
			timestamp = int64(value.(float64))
		case "lastBuild":
			build, ok := value.(map[string]interface{})
			if ok {
				displayName, _ = build["displayName"].(string)
			}
		}
	}

	if timestamp != 0 {
		date := time.Unix(timestamp/1000, 0)
		jobs = append(jobs, Job{
			Name:  name,
			Color: color,
			Date:  date.Format("2006-01-02 15:04:05"),
			Build: displayName,
		})
	} else {
		jobs = append(jobs, Job{
			Name:  name,
			Color: color,
			Build: displayName,
		})
	}
}

func basicAuth(username, password string) string {
	auth := username + ":" + password
	return base64.StdEncoding.EncodeToString([]byte(auth))
}

