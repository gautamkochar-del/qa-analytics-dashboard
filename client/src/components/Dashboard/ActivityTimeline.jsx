import {
  Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, } from "@mui/material";

import BugReportIcon from "@mui/icons-material/BugReport";
import ScienceIcon from "@mui/icons-material/Science";
import FolderIcon from "@mui/icons-material/Folder";

export default function ActivityTimeline({ activity }) {
  const getIcon = (type) => {
    switch (type) {
      case "bug": return <BugReportIcon />;
      case "testrun": return <ScienceIcon />;
      default: return <FolderIcon />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>

        <List>
          {activity.map((item, index) => (
            <div key={index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    {getIcon(item.type)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={item.title}
                  secondary={
                    <>
                      {item.subtitle && (
                        <>
                          {item.subtitle}
                          <br />
                        </>
                      )}
                      {new Date(item.date).toLocaleString()}
                    </>
                  }
                />
              </ListItem>

              {index < activity.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
