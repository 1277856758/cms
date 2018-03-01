export default {
    menu:{},
    role:{},
    user:{},
    permsList:[],
    judAudit(perms){
        if(perms==""||perms==null){ return false;}
        for (let item of this.permsList){
            if(perms==item.perms){
                return true;
            }
        }
        return false;
    },
    AuthorityAudit(uuid,roleName){
        for(var i=0;i<this.permsList.length;i++){
            var  item =this.permsList[i];
            if(item.parentId==uuid){
                switch (item.alias){
                    case "del":
                        roleName.del=item.perms;
                        continue;
                    case "update":
                        roleName.update=item.perms;
                        continue;
                    case "add":
                        roleName.add=item.perms;
                        continue;
                    case "state":
                        roleName.state=item.perms;
                        continue;
                    case "role":
                        roleName.role=item.perms;
                        continue;
                }
            }
        }
    },

};
