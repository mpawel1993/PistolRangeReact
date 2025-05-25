package pl.pistolrange.pistolrange_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.mapper.QuestionMapper;
import pl.pistolrange.pistolrange_server.persistance.QuestionsRepository;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final QuestionsRepository questionsRepository;
    private final QuestionMapper questionMapper;

    public List<QuestionDto> loadQuestionsForExam(){
        var questions = questionsRepository.findAll();
        Collections.shuffle(questions);
        AtomicInteger counter = new AtomicInteger(1);

        return questions.subList(0, 10).stream()
                .map(questionMapper::mapToDto)
                .peek(item -> item.setDisplayId(counter.getAndIncrement()))
                .toList();
    }
}
