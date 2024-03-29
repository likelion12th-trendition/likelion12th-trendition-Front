import { React, useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import logo2 from "../imgs/logo2.png";
import "../css/Mypage.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Goals({ goals, selectedGoalId, setSelectedGoalId }) {
    const [selectedGoalTitle, setSelectedGoalTitle] = useState("");
    const [subgoals, setSubGoals] = useState([]);

    const handleGoalChange = async (e) => {
        e.preventDefault();
        setSelectedGoalId(e.target.value - 1);
        console.log("selected Spec id :", e.target.value);
    };

    useEffect(() => {
        const awsIP = process.env.REACT_APP_BACKEND_URL;
        const token = localStorage.getItem("token");

        axios({
            method: "get",
            url: awsIP + "/home/",
            headers: {
                Authorization: `Token ${token}`,
            },
        }).then((result) => {
            if(result.data.length > 0){
                const result_selectedGoal = result.data[0].title;
                const result_subGoal = result.data[0].subgoals;
    
                if (!selectedGoalTitle.length) {
                    setSelectedGoalTitle(result_selectedGoal);
                    setSubGoals(result_subGoal);
                }
                if (selectedGoalId || selectedGoalId === 0) {
                    setSelectedGoalTitle(goals[selectedGoalId].title);
                    setSubGoals(goals[selectedGoalId].subgoals);
                    console.log("Goals - setSelectedGoalTitle", selectedGoalTitle);
                    console.log("Goals - subgoals", subgoals);
                }
            }
        });

    }, [selectedGoalId]);

    return (
        <div className="Goals">
            <select className="mainGoal-text" onChange={handleGoalChange}>
                {goals.map((goal, index) => (
                    <option key={index} value={index + 1}>
                        {`SPEC ${index + 1} : ${goal.title}`}
                    </option>
                ))}
            </select>
            <GoalCheck
                level={1}
                subgoals={subgoals}
                goalTitle={selectedGoalTitle}
            ></GoalCheck>
            <GoalCheck
                level={2}
                subgoals={subgoals}
                goalTitle={selectedGoalTitle}
            ></GoalCheck>
            <GoalCheck
                level={3}
                subgoals={subgoals}
                goalTitle={selectedGoalTitle}
            ></GoalCheck>
            <GoalCheck
                level={4}
                subgoals={subgoals}
                goalTitle={selectedGoalTitle}
            ></GoalCheck>
            <GoalCheck
                level={5}
                subgoals={subgoals}
                goalTitle={selectedGoalTitle}
            ></GoalCheck>
        </div>
    );
}

function GoalCheck({ level, subgoals }) {
    const subgoal = subgoals ? subgoals[level - 1] : undefined; // subgoal 가져오기

    if (!subgoal) {
        return (
            <div className="subGoal">
                <div className="subGoal-text">
                    <div key={level}>
                        {`Lv - ${level} : 세부 목표가 설정되지 않았습니다`}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="subGoal">
            <input
                className={
                    subgoal.is_completed
                        ? "subGoal-check-checked"
                        : "subGoal-check"
                }
                type="checkbox"
                disabled={subgoal.is_completed}
            />
            <div className="subGoal-text">
                <div key={level}>
                    {`Lv - ${level} : ${subgoal.title}`}
                    <div
                        className="subgoal_imgBtn"
                        style={{
                            width: "70px",
                            height: "43px",
                            marginRight: "3%",
                        }}
                    >
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Mypage() {
    const [data, setData] = useState([]);
    const [goals, setGoals] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState([]);
    const [selectedGoalId, setSelectedGoalId] = useState("");
    const awsIP = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    useEffect(() => {
        axios({
            method: "get",
            url: awsIP + `/home/subgoal/completed/${username}`,
            headers: {
                Authorization: `Token ${token}`,
            },
        }).then((result) => {
            console.log(result.data)
            const completedCount = result.data.reduce((count, subgoal) => {
                return subgoal.is_completed ? count + 1 : count;
            }, 0);
            setCompleted(completedCount || 0)
        });
        axios({
            method: "get",
            url: awsIP + "/home/",
            headers: {
                Authorization: `Token ${token}`,
            },
        }).then((result) => {
            if (result.data && result.data.length > 0) {
                setGoals(result.data);
                console.log("goals", goals);
                if (selectedGoalId) {
                    setSelectedGoal(goals[selectedGoalId]);
                }
            }
        });
        fetch(awsIP + "/join/mypage/", {
            headers: {
                Authorization: `Bearer  ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setData(data);
                console.log(data.profileImage);
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    }, []);

    return (
        <div>
            <div className="mypage_top_setting">
                <div className="TopBar">
                    <div className="TopBar-top">
                        <div className="sublogo">
                            <img className="logo2" src={logo2}></img>
                            <div className="logo2-name">식스펙</div>
                        </div>
                        <p
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textAlign: "center",
                                fontSize: "13px",
                                marginTop: "4vh",
                            }}
                        >
                            @{data.username}
                        </p>
                        <Link to={"/Setting"}>
                            <FontAwesomeIcon
                                icon={faGear}
                                style={{
                                    fontSize: "25px",
                                    color: "#ffffff",
                                    margin: "3vh 20px 0.5vh 50px",
                                }}
                            />
                        </Link>
                    </div>
                </div>
                <div className="mypage_main_profile">
                    <img
                        className="mypage_main_img"
                        src={data.profileImage}
                    ></img>
                    <p>{data.username}</p>
                </div>
            </div>
            <div className="mypage_followBox">
                <p>
                    {data.followers}
                    <Link to="/followers" className="font-gray">
                        Followers
                    </Link>
                </p>
                <p>
                    {data.followings}
                    <Link to="/following" className="font-gray">
                        Following
                    </Link>
                </p>
            </div>
            <div>
                <button className="mypage_doneBtn">{completed} done</button>
            </div>
            <Goals
                goals={goals}
                selectedGoalId={selectedGoalId}
                setSelectedGoalId={setSelectedGoalId}
            ></Goals>
            <Navigation></Navigation>
        </div>
    );
}
