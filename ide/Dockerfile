#FROM ruby:2.7
FROM ruby

WORKDIR /root

RUN apt-get -y update && apt-get -y install bison
RUN apt-get -y install cron
RUN apt-get -y install ruby-bundler

ENV PATH $PATH:/bin

RUN git clone https://github.com/mruby/mruby.git 
# mruby/c 2.0.1
RUN cd mruby && git checkout 2.1.2 && make && cp /root/mruby/bin/mrbc /root/mrbc2.0.1
# mruby/c 3.2.0
RUN cd mruby && make clean && git checkout 3.2.0 && make && cp /root/mruby/bin/mrbc /root/mrbc3.2.0

COPY app .
COPY ide_start.sh .
COPY tmpdel /etc/cron.d

RUN chmod 755 ide_start.sh
RUN chmod 644 /etc/cron.d/tmpdel

RUN bundle install

EXPOSE 4567

CMD ["bash", "ide_start.sh"]
