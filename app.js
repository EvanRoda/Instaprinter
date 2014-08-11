var src_logs = db['sip.log_calls'].find({'src.providers': {$size: 1}});

src_logs.forEach(function(log){
    if (log.src.accounts && log.src.accounts.length == 1){
        var account = db['accounts'].findOne({'_id': log.src.accounts[0]});

        if (account.owner_type != 'private_person'){

            db['sip.log_calls'].update(
                {'_id': log._id},
                {'$set': {'src.source_provider': log.src.providers[0]}}
            );
        }
    }
});

var dst_logs = db['sip.log_calls'].find({'dst.providers': {$size: 1}});
dst_logs.forEach(function(log){
        db['sip.log_calls'].update(
            {'_id': log._id},
            {
                '$set': {'dst.source_provider': log.dst.providers[0]}}
        )
    }
);