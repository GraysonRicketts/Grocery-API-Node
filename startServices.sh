if (redis-server &) && (mongod &) ; then
    echo "Services started"
else
    echo "One or more services failed to start"
fi