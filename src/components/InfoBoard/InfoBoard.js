import { useSelector } from "react-redux";
import {
  getActiveTichus,
  getNameOfYourTeam,
  getOnPlay,
  getTeamsScore,
  getUsernames,
} from "../../redux/selectors";
import "./InfoBoard.scss";
import { isNilOrEmpty } from "ramda-extension";
import { all, isNil, values } from "ramda";

const InfoBoard = () => {
  const scores = useSelector(getTeamsScore);
  const currentPlayer = useSelector(getOnPlay);
  const tichus = useSelector(getActiveTichus);
  const nameOfYourTeam = useSelector(getNameOfYourTeam);
  const usernames = useSelector(getUsernames);

  return (
    <div className="InfoBoard">
      <div className="InfoBoard-teams">
        {scores.map((score, index) => (
          <div key={index}>
            <div>Team {index + 1}</div>
            <div>{score}</div>
          </div>
        ))}
      </div>
      <div className="InfoBoard-nameOfYourTeam">
        (You are on team {nameOfYourTeam})
      </div>
      <div>
        Current player:
        <div>
          {isNilOrEmpty(currentPlayer) ? "None" : usernames[currentPlayer]}
        </div>
      </div>
      <div>
        Actives Tichus:{" "}
        <div>
          {all(isNil, values(tichus))
            ? "None"
            : values(tichus).map((tichu, i) =>
                tichu ? (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                    {tichu}
                  </div>
                ) : null
              )}
        </div>
      </div>
    </div>
  );
};

export default InfoBoard;
