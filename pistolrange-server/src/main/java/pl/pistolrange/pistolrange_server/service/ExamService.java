package pl.pistolrange.pistolrange_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.ExamEntity;
import pl.pistolrange.pistolrange_server.mapper.QuestionMapper;
import pl.pistolrange.pistolrange_server.persistance.ExamRepository;
import pl.pistolrange.pistolrange_server.persistance.QuestionsRepository;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class ExamService {

    public static final String EXAM_DETAILS_ID = "eda93678-b5b2-4699-bd88-bf66331997e2";
    private final QuestionsRepository questionsRepository;
    private final QuestionMapper questionMapper;
    private final ExamRepository examRepository;

    public List<QuestionDto> loadQuestionsForExam() {
        var questions = questionsRepository.findAll();
        Collections.shuffle(questions);
        AtomicInteger counter = new AtomicInteger(1);

        ExamEntity examEntity = examRepository.findById(EXAM_DETAILS_ID)
                .orElseThrow(() -> new RuntimeException("Exam Details not found"));

        return questions.subList(0, examEntity.getAnswersCount()).stream()
                .map(questionMapper::mapToDto)
                .peek(item -> item.setDisplayId(counter.getAndIncrement()))
                .toList();
    }

    public ExamEntity getExamDetails() {
        return examRepository.findById(EXAM_DETAILS_ID)
                .orElseGet(() -> examRepository.save(ExamEntity.builder()
                                .id(EXAM_DETAILS_ID)
                        .examDuration(1800)
                        .answersCount(20)
                        .goodAnswersToPass(18)
                        .build()));
    }
}
