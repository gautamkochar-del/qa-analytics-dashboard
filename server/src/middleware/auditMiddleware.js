import prisma from "../config/prisma.js";

export const auditLog = (resourceName) => {
  return async (req, res, next) => {
    // Capture the original send function
    const originalSend = res.send;

    res.send = function (body) {
      res.send = originalSend;
      
      // Determine action from HTTP method
      let action = "UNKNOWN";
      switch (req.method) {
        case "POST":
          action = "CREATE";
          break;
        case "PUT":
        case "PATCH":
          action = "UPDATE";
          break;
        case "DELETE":
          action = "DELETE";
          break;
      }

      // If the request was successful and it's a mutating action, log it
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user && action !== "UNKNOWN") {
        let resourceId = null;
        
        try {
          const parsedBody = JSON.parse(body);
          if (parsedBody && parsedBody.id) {
            resourceId = parsedBody.id;
          }
        } catch (e) {
          // ignore
        }

        if (!resourceId && req.params.id) {
          resourceId = Number(req.params.id);
        }

        // Fire and forget
        prisma.auditLog
          .create({
            data: {
              userId: req.user.id,
              action,
              resource: resourceName,
              resourceId: resourceId || null,
              details: JSON.stringify(req.body),
            },
          })
          .catch((err) => console.error("Failed to write audit log:", err));
      }

      return res.send(body);
    };

    next();
  };
};
